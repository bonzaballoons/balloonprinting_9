<?php

function toTitleFromURL($string){
    return title_case( str_replace('_', ' ', $string) );
}

function s3ImgSRC($refNum, $size='100') {
    return 'https://bballoons.s3.amazonaws.com/converted_png/'.$refNum.'_'.$size.'.png';
}

function s3ImgFullPathTransform($imgPath){
    return 'https://bballoons.s3.amazonaws.com/'.$imgPath;
}

function s3SiteSRC($imgPath){
    return 'https://s3-eu-west-1.amazonaws.com/bballoons/balloonprintingcouk/'.$imgPath;
}

function priceNet($price){
    return number_format ($price / 1.2, 2);
}

function dbToUKDate($dbDate){
    return Carbon\Carbon::createFromFormat('Y-m-d', $dbDate)->format('d/m/Y');
}

function snake_case($value, $delimiter = '_')
{
    return Str::snake($value, $delimiter);
}

function vatRemove($price, $vat = 20)
{
    return $price-($price * ($vat / 100));
}
