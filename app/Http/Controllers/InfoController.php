<?php

namespace App\Http\Controllers;

use App\Models\Website;
use Illuminate\Http\Request;

class InfoController extends Controller
{
    private $data;
    public function __construct()
    {
        $this->data['navLink'] = 'information';
    }

    // Printing Drop Down

    public function printing_artworkGuidelines()
    {
        $this->data['title'] = 'Artwork Guidelines - Balloon Printing UK';
        $this->data['meta_keywords'] = 'artwork, guidelines';
        $this->data['meta_description'] = 'Need to know exactly how we need your artwork ';

        return view('info/printing/artworkGuidelines', $this->data);
    }

    public function printing_howWePrintOnBalloons()
    {
        $this->data['title'] = 'How We Print On Balloons - Balloon Printing UK';
        $this->data['meta_keywords'] = 'how,print,latex,foil,balloon,balloons,printing';
        $this->data['meta_description'] = 'Everything you need to know about how we print on our latex and foil balloons';

        return view('info/printing/howWePrintOnBalloons', $this->data);
    }

    public function printing_balloonColourCharts()
    {
        $this->data['title'] = 'Balloon Colour Charts - Balloon Printing UK';
        $this->data['meta_keywords'] = 'balloon,colour,charts,find,match,printing,printed,latex,foil';
        $this->data['meta_description'] = 'Find out which colours we print on her at balloonprinting.co.uk';
        $this->data['page_js'] = ['colourCharts'];

        return view('info/printing/balloonColourCharts', $this->data);
    }

    public function printing_inkColourCharts()
    {
        $this->data['title'] = 'Ink Colours and Contrasts - Balloon Printing UK';
        $this->data['meta_keywords'] = 'ink,colour,colours,inks,contrasts,contrast';
        $this->data['meta_description'] = 'Explore our ink colours and contrasts';

        return view('info/printing/inkColourCharts', $this->data);
    }

    public function printing_sizingGasVolumes()
    {
        $this->data['title'] = 'Balloon Gas Sizing Volumes - Balloon Printing UK';
        $this->data['meta_keywords'] = 'helium,gas,cylinder,canister,size,calculate,balloons,balloon';
        $this->data['meta_description'] = 'Calculate how much helium gas you\'ll need to fill your printed balloons';

        return view('info/printing/sizingGasVolumes', $this->data);
    }

    public function printing_freeArtworkChecking()
    {
        $this->data['title'] = 'Free Artwork Checking - Balloon Printing UK';
        $this->data['meta_keywords'] = 'free, artwork, checking';
        $this->data['meta_description'] = 'We\'ll check your artwork for free!';
        $this->data['page_js'] = ['artworkChecker'];

        return view('info/printing/freeArtworkChecking', $this->data);
    }

    // Helium Drop Down

    public function helium_overview()
    {
        $this->data['title'] = 'Balloon Helium Gas Overview - Balloon Printing UK';
        $this->data['meta_keywords'] = 'helium,gas,hire,buy,cylinder,canister,balloon,balloons,fill,disposable';
        $this->data['meta_description'] = 'Fill your printed balloons with one of our hire or disposable helium cylinders';

        return view('info/helium/overview', $this->data);
    }

    public function helium_depotLocator()
    {
        $this->data['title'] = 'Find Your Closest Depot - Balloon Printing UK';
        $this->data['meta_keywords'] = 'locate,find,helium,depot';
        $this->data['meta_description'] = 'Discover where your nearest helium depot is, for those wanting to collect helium hire cylinders';

        return view('info/helium/depotLocator', $this->data);
    }

    public function helium_priceComparison()
    {
        $this->data['title'] = 'Helium Price and Balloon Fill Number - Balloon Printing UK';
        $this->data['meta_keywords'] = 'helium, cylinder, canister, price, quantity, fill, number';
        $this->data['meta_description'] = 'Compare the fill quantities and sizes of our helium cylinders with our easy to use comparison tables';

        return view('info/helium/priceComparison', $this->data);
    }

    public function helium_safety()
    {
        $this->data['title'] = 'Helium Safety Information - Balloon Printing UK';
        $this->data['meta_keywords'] = 'safety, helium';
        $this->data['meta_description'] = 'Make sure you are using your helium cylinders in a safe manner. Please read carefully';

        return view('info/helium/safety', $this->data);
    }

    public function helium_howMuchHelium()
    {
        $this->data['title'] = 'How Much Helium - Balloon Printing UK';
        $this->data['meta_keywords'] = 'quantity,helium,how,balloon,balloons,printed,fill';
        $this->data['meta_description'] = 'Find out how much helium you require for to fill your printed balloons';

        return view('info/helium/howMuchHelium', $this->data);
    }

    // Non Drop-down Links

    public function faqs()
    {
        $this->data['title'] = 'Frequently Asked Questions - Balloon Printing UK';
        $this->data['meta_keywords'] = 'frequently, asked, questions, answers';
        $this->data['meta_description'] = 'Get all the answers to common questions';
        $this->data['faqs'] = Website::find(11)->faqs;

        return view('info/faqs', $this->data);
    }

    public function howTos()
    {
        $this->data['title'] = 'How To Do\'s - Balloon Printing UK';
        $this->data['meta_keywords'] = 'information,how,to,do,todo,guide,guides';
        $this->data['meta_description'] = 'Get useful information on all the products and services we offer alongside our printed balloons';

        return view('info/howTos', $this->data);
    }

    public function testimonials()
    {
        $this->data['title'] = 'Testimonials - Balloon Printing UK';
        $this->data['meta_keywords'] = 'testimonials';
        $this->data['meta_description'] = 'Testimonials For The Jobs We Have Finished';

        return view('info/testimonials', $this->data);
    }

    public function caseStudies()
    {
        $this->data['title'] = 'Case Studies - Balloon Printing UK';
        $this->data['meta_keywords'] = 'testimonials';
        $this->data['meta_description'] = 'Case Studies Of Recently Completed Work';

        return view('info/caseStudies', $this->data);
    }
}
