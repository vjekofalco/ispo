<?php
/**
    Fetching the data from remote API
 */
$request_url = 'https://innovation.ispo.com/api/v1/project/featured';
$response = file_get_contents($request_url);
echo $response;