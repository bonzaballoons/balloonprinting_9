<footer id="footer" class="mt-5 mb-0">
    <div class="container">
        <div class="row">
            <div class="footer-ribbon">
                <span>Get in Touch</span>
            </div>
            <div class="col-lg-3">
                <div class="contact-details">
                    <h4><strong>Contact</strong> Us</h4>
                    <ul class="contact mt-3">
                        <li><p><i class="fa fa-map-marker"></i> <strong class="text-white">Address:</strong> Unit 6, Houghley Lane, Leeds, LS13 2DN</p></li>
                        <li><p><i class="fa fa-phone"></i> <strong class="text-white">Phone:</strong> {{ env('SITE_PHONE_NUMBER') }}, <strong>INT:</strong> {{ env('SITE_INT_PHONE_NUMBER') }}</p></li>
                        <li><p><i class="fa fa-comments"></i><strong class="text-white">Chat Live:</strong> <a style="color: #777" href="{{ url('contact') }}">Click Here</a></p> </li>
                        <li><p><i class="fa fa-envelope"></i> <strong class="text-white">Email:</strong> info@balloonprinting.co.uk</p></li>
                    </ul>
                    <ul class="social-icons-custom mt-3">
                        <li>
                            <a href="https://www.instagram.com/balloonprinting/" class="instagram_icon" target="_blank" title="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:" data-toggle="modal" data-target="#whatsAppModal" class="whatsapp_icon" title="WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/company/balloonprinting/" class="linkedin_icon" target="_blank" title="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <br>
            </div>
            <div class="col-lg-6">
                <h4 class="mb-3"><strong>Who</strong> We Are</h4>
                <p style="font-size: 15px;">A friendly company based in Leeds and shipping all across the UK, EU and Beyond, we are a dedicated group of screen printing professionals specialising in the custom printing of balloons. An enjoyable business to be in, we offer an award winning level of customer service and superb quality products.</p>

                <a href="{{ url('about') }}" class="btn btn-outline btn-primary mt-2 mb-2">Find Out More</a>
            </div>
            <div class="col-lg-3">
                <h4><strong>Latest </strong>Works</h4>

                <div class="lightbox" data-plugin-options="{'delegate': 'a', 'type': 'image', 'gallery': {'enabled': true}, 'mainClass': 'mfp-with-zoom', 'zoom': {'enabled': true, 'duration': 300}}">
                    <a class="img-thumbnail d-inline-block img-thumbnail-hover-icon mb-1 mr-1" href="{{ asset('img/bonza/ribenaFooter.jpg') }}">
                        <img class="img-fluid" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" alt="Project Image" width="65" height="65">
                    </a>
                    <a class="img-thumbnail d-inline-block img-thumbnail-hover-icon mb-1 mr-1" href="{{ asset('img/bonza/whittardFooter.jpg') }}">
                        <img class="img-fluid" src="{{ asset('img/bonza/whittardFooter.jpg') }}" alt="Project Image" width="65" height="65">
                    </a>
                    <a class="img-thumbnail d-inline-block img-thumbnail-hover-icon mb-1 mr-1" href="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}">
                        <img class="img-fluid" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" alt="Project Image" width="65" height="65">
                    </a>
                    <a class="img-thumbnail d-inline-block img-thumbnail-hover-icon mb-1 mr-1" href="{{ asset('img/bonza/happyBirthdaySweetieFooter.jpg') }}">
                        <img class="img-fluid" src="{{ asset('img/bonza/happyBirthdaySweetieFooter.jpg') }}" alt="Project Image" width="65" height="65">
                    </a>
                    <a class="img-thumbnail d-inline-block img-thumbnail-hover-icon mb-1 mr-1" href="{{ asset('img/bonza/nichollsSaleFooter.jpg') }}">
                        <img class="img-fluid" src="{{ asset('img/bonza/nichollsSaleFooter.jpg') }}" alt="Project Image" width="65" height="65">
                    </a>
                    <a class="img-thumbnail d-inline-block img-thumbnail-hover-icon mb-1 mr-1" href="{{ asset('img/bonza/starbucksFooter.jpg') }}">
                        <img class="img-fluid" src="{{ asset('img/bonza/starbucksFooter.jpg') }}" alt="Project Image" width="65" height="65">
                    </a>
                </div>
                <a href="{{ url('portfolio') }}" class="btn-flat float-right btn-xs view-more-recent-work">View More <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
    <div class="footer-copyright mt-0 mb-0">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <p>© Copyright Balloonprinting.co.uk {{ date('Y') }}. All Rights Reserved.</p>
                </div>
                <div class="col-lg-6">
                    <nav id="sub-menu">
                        <ul>
                            <li><a target="_blank" href="https://lc.chat/now/6023681/">Chat Live With Us</a></li>
                            <li><a href="{{ url('info/faqs') }}">FAQ's</a></li>
                            <li><a href="{{ url('sitemap') }}">Sitemap</a></li>
                            <li><a href="{{ url('contact') }}">Contact</a></li>
                            <li><a href="{{ url('privacy') }}">Privacy</a></li>
                            <li><a href="{{ url('terms') }}">Terms</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</footer>