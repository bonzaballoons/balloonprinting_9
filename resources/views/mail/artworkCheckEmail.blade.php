<body>
    <h4>Artwork Check Sent From BalloonPrinting.co.uk</h4>
    <p><strong>Date Check Requested:</strong>{!! $dateRequestMade !!}</p>
    <p><strong>Name:</strong> {!! $name !!}</p>
    <p><strong>Email:</strong> {!! $email !!}</p>
    <p><strong>Artwork Links:</strong> <br></p>
    <ul>
        @foreach($artworkLinks as $link)
            <li><a href="{!! $link !!}">Click Here For Artwork</a></li>
        @endforeach
    </ul>
</body>