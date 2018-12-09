$(document).ready(function() {
    var host = "http://172.16.0.7:3001";
    var accountPath = "/account";
    var batchPath = "/batch";

    $(".request-account").click(function() {
        var body = "";
        $.post(
            host + accountPath,
            body,
            function(data, status) {
                $(".request-account-response-status").text(status === "success" ? "Account created successfully" : "Something went wrong please try again later");
                $(".request-account-response-data").text("Your seed phrase is: " + data["User seed phrase"]);
            }
        );
    });

    $(".create-batch").click(function() {
        var seedPhrase = $(".seed-phrase").val().trim();
        var name = $(".name").val().trim();
        var manufacturerName = $(".manufacturer-name").val().trim();
        var batchId = $(".batch-id").val().trim();
        var body = {
            seedPhrase: seedPhrase,
            batchInfo:{
                name: name,
                manafacturerName: manufacturerName,
                uuid: batchId
            }
        };
        $.post(
            host + batchPath,
            body,
            function(data, status) {
                $(".create-batch-response-status").text(status === "success" ? "Batch created successfully" : "Something went wrong please try again later");
                // $(".create-batch-response-data").text("Your Batch details are: " + data);
            }
        );
    });

    $(".get-batch").click(function() {
        var batchId = $(".get-batch-id").val().trim();
        $.get(
            host + batchPath + "/" + batchId,
            function(data, status) {
                $(".get-batch-response-status").text(status === "success" ? "Batch info retrieved successfully" : "Something went wrong please try again later");
                $(".get-batch-response-data").text("Name: " + data[0] + "\tManufacturer Name: " + data[1]);
            }
        );
    });
 });