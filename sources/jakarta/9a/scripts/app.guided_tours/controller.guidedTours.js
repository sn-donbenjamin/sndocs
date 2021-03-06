/*! RESOURCE: /scripts/app.guided_tours/controller.guidedTours.js */
if (typeof top.NOW.guidedToursService == 'undefined') {
  CustomEvent.observe(EmbeddedHelpEvents.HOPSCOTCH_TOUR_START, function(args) {
    if (Array.isArray(args)) {
      top.NOW.guidedToursService.log("observing hopscotch: " + args[0] + " " + args[1]);
      top.NOW.guidedToursService.startTour(args[0], Number(args[1]));
    } else {
      top.NOW.guidedToursService.startTour(args, 0);
    }
  });
  CustomEvent.observe(EmbeddedHelpEvents.HOPSCOTCH_TOUR_END, function() {
    top.NOW.guidedToursService.endTour();
  });
  CustomEvent.observe("page_loaded_fully", function(args) {
    if (sessionStorage.getItem('guided_tour:tour.state') != null) {
      top.NOW.guidedToursService.startTourFromState(sessionStorage.getItem('guided_tour:tour.state'));
    } else if (top.hopscotch !== undefined) {
      top.NOW.guidedToursService.log("page_loaded_fully event: hopscotch state is: " + hopscotch.getState());
      if (top.hopscotch.getState() !== null) {
        top.NOW.guidedToursService.startTourFromState(hopscotch.getState());
      }
    }
  });
};