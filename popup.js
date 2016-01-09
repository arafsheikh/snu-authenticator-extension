document.addEventListener('DOMContentLoaded', function() {
  var btnSave = document.getElementById('save');
  var btnReset = document.getElementById('reset');
  
  // Save SNU NET ID and Password to local storage
  chrome.storage.local.get("snuid", function(data) {
    if (data.snuid !== undefined) {
      document.getElementsByTagName('input')[0].value = data.snuid;
    }
  });
  chrome.storage.local.get("password", function(data) {
    if (data.password !== undefined) {
      document.getElementsByTagName('input')[1].value = data.password;
      document.getElementsByTagName('input')[2].value = data.password;
    }
  });

  btnSave.addEventListener('click', function() {
    var data = {};
    var snuid = document.getElementsByTagName('input')[0].value;
    var password = document.getElementsByTagName('input')[1].value;
    var password2 = document.getElementsByTagName('input')[2].value;

    if (snuid == "" || password == "") {
      document.getElementById('status').innerHTML = "Please fill in all the fields."
      document.getElementById('status').style.color = "red";
    }
    else if (password === password2) {
      data["snuid"] = snuid;
      data["password"] = password;
      chrome.storage.local.set(data, function() {
        document.getElementById('status').innerHTML = "Credentials saved."
        document.getElementById('status').style.color = "green";
        btnSave.disabled = true;
        // Once user saves credentials log the user in.
        login_logout("191");
      });
    }
    else {
      document.getElementById('status').innerHTML = "Password mismatch."
      document.getElementById('status').style.color = "red";
    }
  });

  btnReset.addEventListener('click', function() {
    document.getElementsByTagName('input')[0].value = "";
    document.getElementsByTagName('input')[1].value = "";
    document.getElementsByTagName('input')[2].value = "";

    var data = {};
    data["snuid"] = "";
    data["password"] = "";
    chrome.storage.local.set(data, function() {
      document.getElementById('status').innerHTML = "Credentials reset."
      btnSave.disabled = false;
    });
  });
});

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
