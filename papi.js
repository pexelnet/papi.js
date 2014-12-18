// Global variabiles.
var papi_apiRoot = "";
var papi_accessKey = "";

// Support methods.
String.prototype.endsWith = function(str) {
    var lastIndex = this.lastIndexOf(str);
    return (lastIndex != -1) && (lastIndex + str.length == this.length);
}

// Main methods.
/**
 * Initializes pexel api javascript interface with specified api root url.
 */
function papi_init(api_root) {
	if(api_root.endsWith("/")) {
		papi_apiRoot = api_root;
	} else {
		papi_apiRoot = api_root + "/";
	}
}

/**
 * Executes async ajax call on api with specified method, url, params and callback.
 */
function papi_ajax(method, url, params, ajax_callback) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			json_object = JSON.parse(xmlhttp.responseText);
			ajax_callback(json_object, xmlhttp.status);
		}
	}
	xmlhttp.setRequestHeader("Access-Key", papi_accessKey);
	if(method == "POST") {
		xmlhttp.open(method, papi_apiRoot + url, true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send(params);
	} else {
		xmlhttp.open(method, papi_apiRoot + url, true);
		xmlhttp.send();
	}
}

/**
 * Executes GET async ajax call on api with specified url and callback.
 */
function papi_get(url, ajax_callback) {
	papi_ajax("GET", url, "", ajax_callback);
}

/**
 * Executes POST async ajax call on api with specified url, parameters and callback. Parameters should be in object (key, value) format.
 */
function papi_post(url, params, ajax_callback) {
	var params_string = "";
	Object.keys(params).forEach(function (key) {
	   params_string += key + "=" + params[key] + "&";
	});
	params_string = params_string.slice(0, - 1);
	papi_ajax("POST", url, params_string, ajax_callback);
}

/**
 * Executes GET async ajax call on api but simpifies callback (ajax_callback) to provide only returned JSON object to callback(basic_callback).
 */
function papi_get_basic(url, basic_callback) {
	papi_get(url, function (json_object, status) {
		basic_callback(json_object);
	});
}

// API methods.

/**
 * Verifies access key by using basic /verify api cal..
 */
function papi_verify(access_key, verify_callback) {
	papi_accessKey = access_key;
	papi_ajax("GET", "verify", "", function (json_object, status) {
		if(status == 200 && json_object.success == true) {
			verify_callback(true);
		} else {
			verify_callback(false);
		}
	});
}

/**
 * Executes /slaves api call.
 */
function papi_slaves(object_callback) {
	papi_get_basic("slaves", object_callback);
}

/**
 * Executes /slave/{name} api call.
 */
function papi_slave(slave_name, object_callback) {
	papi_get_basic("slave/" + name, object_callback);
}

// ========================================= USAGE

/*
papi_init("http://localhost:10361/api");
papi_verify("7a84e34b51acc68a89799d960850036f", function (success) {
	if(success == true) {
		// Todo.
	}
});
*/