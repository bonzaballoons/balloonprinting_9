<?php

namespace App\Http\Middleware;

use Closure;
use App\BasketManager;
use App\OrderDetailsRepository;

class InitiateSessionData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        if (! $request->session()->has('basket') ) {
            $request->session()->put('basket', new BasketManager() );
        }

        if (! $request->session()->has('orderDetails') ) {
            $request->session()->put('orderDetails', new OrderDetailsRepository() );
        }

        return $next($request);
    }
}
