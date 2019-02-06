function filterPetsBySpecies() {
    //get the id of the selected homeworld from the filter dropdown
    var specie_id = document.getElementById('species_filter').value
    //construct the URL and redirect to it
    window.location = '/pets/filter/' + parseInt(specie_id)
}
