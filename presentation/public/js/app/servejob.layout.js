function searchInput(element) {
    var value = element.value;
    if (value) {
        window.location.hash = "#!/jobs/search/" + value;
    } else if (window.location.hash.indexOf("#!/jobs/search/") === 0){
        window.location.hash = "#!/";
    }
}
