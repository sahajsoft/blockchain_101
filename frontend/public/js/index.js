$(document).ready(function () {
  var host = "http://localhost:3001";
  var accountPath = "/account";
  var batchPath = "/batch";
  var logsPath = "/logs";

  $(".request-account").click(function () {
    var body = "";
    $.post(
      host + accountPath,
      body,
      function (data, status) {
        $(".request-account-response-status").text(status === "success" ? "Account created successfully - " + data["to"] : "Something went wrong please try again later");
        $(".request-account-response-data").text("Your seed phrase is: " + data["seed"]);
      }
    );
  });

  $(".create-batch").click(function () {
    var seedPhrase = $(".seed-phrase").val().trim();
    var name = $(".name").val().trim();
    var manufacturerName = $(".manufacturer-name").val().trim();
    var batchId = $(".batch-id").val().trim();
    var body = {
      seedPhrase: seedPhrase,
      batchInfo: {
        name: name,
        manufacturerName: manufacturerName,
        uuid: batchId
      }
    };
    $.ajax({
      type: 'POST',
      url: host + batchPath,
      data: JSON.stringify(body),
      dataType: "json",
      contentType: 'application/json',
      success: function (data, status) {
        $(".create-batch-response-status").text(status === "success" ? "Batch created successfully" : "Something went wrong please try again later");
        // $(".create-batch-response-data").text("Your Batch details are: " + data);
      }
    });
  });

  $(".get-batch").click(function () {
    var batchId = $(".get-batch-id").val().trim();
    $.get(
      host + batchPath + "/" + batchId,
      function (data, status) {
        $(".get-batch-response-status").text(status === "success" ? "Batch info retrieved successfully" : "Something went wrong please try again later");
        $(".get-batch-response-data").text("Name: " + data[0] + "\tManufacturer Name: " + data[1]);
      }
    );
  });

  $(".transfer-batch").click(function () {
    var batchId = $(".transfer-batch-id").val().trim();
    var seedPhrase = $(".transfer-seed-phrase").val().trim();
    var to = $(".transfer-to").val().trim();
    var body = {
      seedPhrase: seedPhrase,
      to: to
    };
    $.ajax({
      type: 'POST',
      url:   host + batchPath + "/" + batchId + "/transfer",
      data: JSON.stringify(body),
      dataType: "json",
      contentType: 'application/json',
      success: function (data, status) {
        $(".transfer-batch-response-status").text(status === "success" ? "Batch transferred successfully" : "Something went wrong please try again later");
        // $(".transfer-batch-response-data").text("Name: " + data[0] + "\tManufacturer Name: " + data[1]);
      }
    });
  });

  $(".check-batch").click(function () {
    var batchId = $(".check-batch-id").val().trim();
    var ownerAddress = $(".check-owner-id").val().trim();
    $.get(
      host + batchPath + "/" + batchId + "/checkOwner/" + ownerAddress,
      function (data, status) {
        $(".check-batch-response-status").text(data ? "Is current owner" : "Is not the owner");
        // $(".transfer-batch-response-data").text("Name: " + data[0] + "\tManufacturer Name: " + data[1]);
      }
    );
  });

  function createTableHeader(headers) {
    return headers.map(function(header) {
      return "<th scope=\"col\">" + header.toUpperCase() + "</th>";
    }).toString().replace(/,/g, "");
  }

  function createTableBody(body) {
    var keys = Object.keys(body[0]);
    return body.map(function(e) {
      return "<tr>" + 
        keys.map(function(key) {
          if(key === "timestamp") {return "<td>" + new Date(e[key] * 1000) + "</td>";}
          return "<td>" + e[key] + "</td>";
        }).toString().replace(/,/g, "") + "</tr>";
    }).toString().replace(/,/g, "");
  }

  setInterval(function() {
    $.get(
      host + logsPath,
      function(data, status) {
        if(status === "success" && data.length > 0) {
          var info = data.map(function(e) { return e.args; });
          $(".audit-log").empty();
          $(".audit-log").prepend(
            "<thead><tr>" +  createTableHeader(Object.keys(info[0])) + "</tr></thead>" + "<tbody>" + createTableBody(info) + "</tbody>"
          );
        }
      }
    );
  }, 2000);
});
