var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: 'http://openlayers.org/en/v3.18.2/examples/data/geojson/countries.geojson',
          format: new ol.format.GeoJSON()
        }),
        opacity:0
      });
var map = new ol.Map({
 layers: [
 new ol.layer.Tile({
 source: new ol.source.BingMaps({
 key:'*********',
 imagerySet: 'AerialWithLabels'
 }),
 title: 'Bing AerialWithLabels'
 }),
 vector
 ]
});
var selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
      });
var popup = new ol.Overlay({
        element: document.getElementById('popup')
      });
      map.addOverlay(popup);
map.addInteraction(selectPointerMove);
map.on('click', function(evt) {
var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
var element = popup.getElement();
console.log('element',element);
$(element).popover('destroy');
popup.setPosition(evt.coordinate);
  var lon = lonlat[0].toString();
  var lat = lonlat[1].toString();
  $.ajax({
  url: 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&appid=********',
  success: weatherJson,
  dataType: 'json'
});
});

var weatherJson = function(data){
	console.log('outside',data.name);
	console.log('outside',data);
	var city = data.name;
	var country = data.sys.country.toUpperCase();
	var title = '<div class="container"><div class="row"><div class="customDiv"><img src="./assets/data/flags/'+country+'.png"></img>'
	+'<p class="myTitle">'+city+'</p></div></div></div>';
	var icon = data.weather[0].icon;
	var temp = data.weather[0].description;
	var degree = "\u00b0"
	var desc = toTitleCase(temp);
	var temprature = data.main.temp;
	console.log(icon); 
	var $img = '<div class="container"><div class="row"><div class="customDivWeather"><p class="myWeather">'+desc+'</p><img class="weatherImg" src="http://openweathermap.org/img/w/'+icon+'.png"></img>'
	+'<p class="myWeather">'+temprature+degree+'</p></div></div></div>';
	
	var element = popup.getElement();
	
	$(element).popover({
          'placement': 'top',
          'title': title,
          'animation': false,
          'html': true,
          'content': $img,
          'offset' :'0 0'
        });
        $(element).popover('show');
	
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


//map.addControl(mousePositionControl);
map.setTarget('map');
var view = new ol.View({
 zoom: 4,
 projection: 'EPSG:3857',
 maxZoom: 6,
 minZoom: 2,
 rotation: 0.34 // 20 degrees
});
view.setCenter([-10800000, 4510000]);
map.setView(view);



