<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\HeliumDisposable;
use App\Models\HeliumHire;
use App\Models\Menu;
use JavaScript;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PricesController extends Controller
{
    private $data;

    public function __construct()
    {
       $this->data['navLink'] = 'prices';
    }

    public function latexPrinted()
    {
        $this->data['title'] = 'Latex Custom Printed Balloons Prices - Balloon Printing UK';
        $this->data['meta_keywords'] = 'Latex,Custom,Printed,printing,print,balloons,balloon,prices,price';
        $this->data['meta_description'] = 'No need to ring, get a price for your printed latex balloons online';

        $date = Carbon::now();
        $isWeekend = $date->dayOfWeek === Carbon::SATURDAY || $date->dayOfWeek === Carbon::SUNDAY;
        JavaScript::put('nextDayAvailable',  $date->hour < 12 && !$isWeekend);

        $this->data['page_js'] = ['latexWizard'];

        return view('prices/latexPrinted', $this->data);
    }

    public function foilPrinted()
    {
        $this->data['title'] = 'Foil Custom Printed Balloon Prices - Balloon Printing UK';
        $this->data['meta_keywords'] = 'Foil,Custom,Printed,printing,print,balloons,balloon,prices,price';
        $this->data['meta_description'] = 'No need to ring, get a price for your printed foil balloons online';

        $this->data['page_js'] = ['foilWizard'];

        return view('prices/foilPrinted', $this->data);
    }

    public function giantLatexPrinted()
    {
        $this->data['title'] = 'Giant Latex Custom Printed Balloons Prices - Balloon Printing UK';
        $this->data['meta_keywords'] = 'Giant,Big,Huge,Mega,Massive,2ft,3ft,Latex,Custom,Printed,printing,print,balloons,balloon,prices,price';
        $this->data['meta_description'] = 'Get absolutely giant custom printed latex balloons for your event';

        $date = Carbon::now();
        $isWeekend = $date->dayOfWeek === Carbon::SATURDAY || $date->dayOfWeek === Carbon::SUNDAY;
        JavaScript::put('nextDayAvailable',  $date->hour < 12 && !$isWeekend);

        $this->data['page_js'] = ['giantLatexWizard'];

        return view('prices/giantLatexPrinted', $this->data);
    }

    public function helium()
    {
        $this->data['title'] = 'Helium Gas Hire Or Buy Prices - Balloon Printing UK';
        $this->data['meta_keywords'] = 'Hire,Gas,Canisters,Cylinder,Bottle,Deliver,Collect,Disposable';
        $this->data['meta_description'] = 'Whatever the size of your event, we have hire and disposable cylinders to suit.';

        $this->data['hireDescription'] = Category::select('desc')->find(59)->desc;
        $this->data['hireCylinders'] = HeliumHire::get();

        $this->data['disposableDescription'] = Category::select('desc')->find(60)->desc;
        $this->data['disposableCylinders'] = HeliumDisposable::get();

        return view('prices/helium', $this->data);
    }

    public function promotionalBalloonInABox()
    {
        $this->data['title'] = 'Promotional Balloon in a Box Prices - Balloon Printing UK';
        $this->data['meta_keywords'] = 'send,post,balloon,box,bouquet,corporate,promotional,gift,marketing,advertise,mail,business,company,foil';
        $this->data['meta_description'] = 'Promote your business by sending out a custom printed \'Balloon in a Box\'. Print your logo or brand message on a selection of our foil balloons and let us do the rest!';

        return view('prices/promotionalBalloonInABox', $this->data);
    }

    public function accessories()
    {
        $menu = Menu::getCategoriesWithURLAndImage(21);

        $this->data['title'] = 'Accessory Prices - Balloon Printing UK';
        $this->data['meta_keywords'] = !empty( $menu['meta_key'] ) ? $menu['meta_key'] : 'accessory,accesories,price,prices';
        $this->data['meta_description'] = !empty( $menu['meta_desc'] ) ? $menu['meta_desc'] : 'We have all the accessories you might need to accompany your printed balloons';
        $this->data['menu'] = $menu;

        return view('prices/accessories', $this->data);
    }
}
