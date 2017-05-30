$(document).ready(function() {
	<!--Before Scenarios-->
	$('#addbeforescenario').click(function(e) {
    e.preventDefault();
		$('#beforescenarios').append('<div><input type="text" value="" id="beforescenarios" name="beforescenarios">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deletebeforescenario">Delete</button></div>');
   });
	});
	$('body').on('click', '#deletebeforescenario', function(e) {
		$(this).parent('div').remove();
	});
	<!--Negative Consequences-->
	$('#addnegativeconsequence').click(function(e) {
		$('#negativeconsequences').append('<div><input type="text" value="" id="negativeconsequences" name="negativeconsequences">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deletenegativeconsequence">Delete</button></div>');
	});
	$('body').on('click', '#deletenegativeconsequence', function(e) {
		$(this).parent('div').remove();
	});
	<!--After Scenarios-->
	$('#addafterscenario').click(function(e) {
		$('#afterscenarios').append('<div><input type="text" value="" id="afterscenarios" name="afterscenarios">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deleteafterscenario">Delete</button></div>');
	});
	$('body').on('click', '#deleteafterscenario', function(e) {
		$(this).parent('div').remove();
	});
	<!--Positive Business Outcome-->
	$('#addpositivebusinessoutcome').click(function(e) {
		$('#positivebusinessoutcomes').append('<div><input type="text" value="" id="positivebusinessoutcomes" name="positivebusinessoutcomes">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deletepositivebusinessoutcome">Delete</button></div>');
	});
	$('body').on('click', '#deletepositivebusinessoutcome', function(e) {
		$(this).parent('div').remove();
	});
  <!--Required Capability-->
	$('#addrequiredcapability').click(function(e) {
		$('#requiredcapabilities').append('<div><input type="text" value="" id="requiredcapabilities" name="requiredcapabilities">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deleterequiredcapability">Delete</button></div>');
	});
	$('body').on('click', '#deleterequiredcapability', function(e) {
		$(this).parent('div').remove();
	});
  <!--How we do it -->
	$('#addhowwedoit').click(function(e) {
		$('#howwedoits').append('<div><input type="text" value="" id="howwedoits" name="howwedoit">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deletehowwedoit">Delete</button></div>');
	});
	$('body').on('click', '#deletehowwedoit', function(e) {
		$(this).parent('div').remove();
	});
  <!--How we do it better -->
	$('#addhowwedoitbetter').click(function(e) {
		$('#howwedoitbetters').append('<div><input type="text" value="" id="howwedoitbetters" name="howwedoitbetter">' +
			'<button type="button" class="btn btn-danger btn-sm" id="deletehowwedoitbetter">Delete</button></div>');
	});
	$('body').on('click', '#deletehowwedoitbetter', function(e) {
		$(this).parent('div').remove();
	});
})
