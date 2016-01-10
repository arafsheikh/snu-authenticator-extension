console.log("Background script running...");

/**
* Logs the user in or out based on the 'code' parameter passed.
* "191" --> Log-in
* "193" --> Log-out
*/
function login_logout (code) {
    var snuid = "";
    var password = "";

    chrome.storage.local.get("snuid", function(data) {
        snuid = data.snuid;
        chrome.storage.local.get("password", function(data) {
            password = data.password;

            if (snuid != "" && password != "") {
                var http = new XMLHttpRequest();
                var url = "http://192.168.50.1/24online/servlet/E24onlineHTTPClient";
                var params = "mode=" + code + "&username=" + snuid + "@snu.in&password=" + password;
                http.open("POST", url, true);

                //Send the proper header information along with the request
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                //http.setRequestHeader("Content-length", params.length);
                //http.setRequestHeader("Connection", "close");

                http.onreadystatechange = function() {//Call a function when the state changes.
                    if(http.readyState == 4 && http.status == 200) {
                        console.log("Login success");
                    }
                }
                http.send(params);
            }
        });
      });
    
}

chrome.runtime.onStartup.addListener(login_logout("191")); // log-in
