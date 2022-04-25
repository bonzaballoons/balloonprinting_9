@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Balloon </strong>Colour Charts</h1>
    </x-page-header>
    <div id="colourCharts" class="container">

        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-body">
                        <h2 class="text-center"><strong>Latex </strong>Balloons Colours</h2>

                        <h5 class="text-center heading-primary"><strong><i class="fas fa-angle-down heading-secondary"></i> Select a balloon type</strong></h5>
                        <select title="latexBalloonType" class="form-control" v-model="latexTypeSelected">
                            <option v-for="latexColourType in latexColours" :value="latexColourType">
                                @{{ latexColourType.name }}
                            </option>
                        </select>
                        <h5 class="text-center heading-primary mt-4"><strong><i class="fas fa-angle-down heading-secondary"></i> Click on a colour below</strong></h5>
                        <div class="d-flex flex-wrap justify-content-around">
                            <div v-for="colour in latexTypeSelected.colours" :style="{ 'background-color': colour.cssColour }" class="colour_pick_square" @click="showColourPreview(colour, 'latex')"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-body">
                        <h2 class="text-center"><strong>Foil </strong>Balloons Colours</h2>

                        <h5 class="text-center heading-primary"><strong><i class="fas fa-angle-down heading-secondary"></i> Select a balloon type</strong></h5>
                        <select title="latexBalloonType" class="form-control" v-model="foilTypeSelected">
                            <option v-for="foilColourType in foilColours" :value="foilColourType">
                                @{{ foilColourType.name }}
                            </option>
                        </select>
                        <h5 class="text-center heading-primary mt-4"><strong><i class="fas fa-angle-down heading-secondary"></i> Click on a colour below</strong></h5>
                        <div class="d-flex flex-wrap justify-content-around">
                            <div v-for="colour in foilTypeSelected.colours" :style="{ 'background-color': colour.cssColour }" class="colour_pick_square" @click="showColourPreview(colour, 'foil')"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                            <div class="flex_colour_pick_square_dummy"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="colourPreview" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Colour - <span v-if="colourSelected">@{{ colourSelected.name }}</span></h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <div class="modal-body text-center">
                        <div v-if="colourSelected">
                            <img class="img-fluid" :src="displayImagePath" :alt="colourSelected.name">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
