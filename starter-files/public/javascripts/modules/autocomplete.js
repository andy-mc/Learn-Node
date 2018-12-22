function autocomplete(input, latInput, lngInput) {
  // skip this fn from running if there is not input/address on the page
  if (!input) return;
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry ? place.geometry.location.lat() : '-0.180653';
    lngInput.value = place.geometry ? place.geometry.location.lng() : '-78.467834';
  });
  //  If someone hits enter on the address field, don't submit
  //  the form
  input.on('keydown', e => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}

export default autocomplete;
