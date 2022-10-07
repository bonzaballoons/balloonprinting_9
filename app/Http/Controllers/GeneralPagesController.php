<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Website;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactUs;

class GeneralPagesController extends Controller
{
    public function index()
    {
        $data['title'] = 'Home - Balloon Printing UK';
        $data['navLink'] = 'home';
        $data['meta_keywords'] = 'balloon, printing';
        $data['meta_description'] = 'Balloon Printing in the UK';

        return view('generalPages/index', $data);
    }

    public function contact()
    {
        $data['title'] = 'Contact Us - Balloon Printing UK';
        $data['navLink'] = 'contact';
        $data['meta_keywords'] = 'contact, us';
        $data['meta_description'] = 'Contact The Print Team';

        return view('generalPages/contact', $data);
    }

    public function contactThankYou(Request $request){

        $data['title'] = 'Contact Us Success - Balloon Printing UK';
        $data['navLink'] = 'contact';
        $data['meta_keywords'] = 'Contact,Thanks,Thank,You';
        $data['meta_description'] = 'Successful Contact Us';

        // Set the honey trap for spam bots
        if( empty( $request->input('customer_title') ) ){

            $request->validate([
                'customer_name' => 'required',
                'customer_email' => 'required|email',
                'customer_phone' => 'required',
                'customer_message' => 'required'
            ]);

            Mail::to('info@balloonprinting.co.uk')->send(new ContactUs( $request ) );
        }

        $data['mailSent'] = true;
        $data['name'] = $request->input('customer_name');

        return view('generalPages/contactThankYou', $data);
    }

    public function about()
    {
        $data['title'] = 'About Us - Balloon Printing UK';
        $data['navLink'] = 'about';
        $data['meta_keywords'] = 'about, us';
        $data['meta_description'] = 'About Us, Our Work & Our Machines!';

        return view('generalPages/about', $data);
    }

    public function portfolio()
    {
        $data['title'] = 'Our Portfolio - Balloon Printing UK';
        $data['navLink'] = 'portfolio';
        $data['meta_keywords'] = 'portfolio, work';
        $data['meta_description'] = 'See Some Of Our Best Work!';

        return view('generalPages/portfolio', $data);
    }

    public function sitemap()
    {
        $data['title'] = 'Sitemap - Balloon Printing UK';
        $data['meta_keywords'] = 'sitemap';
        $data['meta_description'] = 'A Map Of Our Site';

        return view('generalPages/sitemap', $data);
    }

    public function privacy()
    {
        $data['title'] = 'Privacy - Balloon Printing UK';
        $data['meta_keywords'] = 'privacy';
        $data['meta_description'] = 'Our Privacy Statement';
        $data['privacy'] = Website::find(11)->privacy;

        return view('generalPages/privacy', $data);
    }

    public function terms()
    {
        $data['title'] = 'Terms & Conditions - Balloon Printing UK';
        $data['meta_keywords'] = 'terms, conditions';
        $data['meta_description'] = 'Our Terms & Conditions';
        $data['terms'] = Website::find(11)->terms;

        return view('generalPages/terms', $data);
    }
}
