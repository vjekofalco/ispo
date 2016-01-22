<?php
/**
    Fetching the data from remote API
 */
$request_url = 'https://innovation.ispo.com/api/v1/project/featured';
$response = get_url($request_url);

function get_url($request_url) {

    $resp = file_get_contents($request_url);
    return $resp;
}

echo $response;
?>