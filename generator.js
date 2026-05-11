const isSerie = document.getElementById('serie');
const isMovie = document.getElementById('movie');
const types = document.querySelectorAll('input[type=radio][name=type]');
const template = document.getElementById('html-final');
const btnCopiar = document.getElementById('copiar');

// Mostrar/Ocultar selector de temporada
types.forEach(type => {
    type.addEventListener('change', () => {
        document.getElementById('season-selector').style.display = (type.value === "movie") ? "none" : "block";
    });
});

// Función de copiado con aviso visual
btnCopiar.addEventListener('click', () => {
    const textToCopy = template.innerText;
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        setTimeout(() => { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
});

async function generar() {
    const key = document.getElementById('numero').value;
    const season = document.getElementById('numeroTemporada').value;
    const apiKey = "c71d55c790adcb0fa9ea6ebcbc9a61a7";
    const lang = "es-MX";

    if (!key) return;

    try {
        if (isSerie.checked) {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${key}?api_key=${apiKey}&language=${lang}`);
            const resSeason = await fetch(`https://api.themoviedb.org/3/tv/${key}/season/${season}?api_key=${apiKey}&language=${lang}`);
            
            if (res.status === 200) {
                const datos = await res.json();
                const datosS = await resSeason.json();
                
                const tags = datos.genres.map(g => g.name).join(', ');
                const epList = datosS.episodes.map(e => `[Episodio ${e.episode_number}|URL_AQUÍ]`).join('\n');
                
                let output = `[stt/Serie]\n[sc/${datos.vote_average.toFixed(1)}]\n\n<img src="https://image.tmdb.org/t/p/w300${datos.poster_path}" style="display:none;"/>\n\n[nd]\n${datos.overview}\n[/nd]\n\n[br/Temporada ${season}]\n${epList}`;
                
                template.innerText = (season == 1) ? output : `[br/Temporada ${season}]\n${epList}`;
                
                // Preview
                document.getElementById('info-poster').src = `https://image.tmdb.org/t/p/w300${datos.poster_path}`;
                document.getElementById('info-title').innerText = datos.name;
                document.getElementById('info-year').innerText = datos.first_air_date.slice(0,4);
            }
        } else {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${key}?api_key=${apiKey}&language=${lang}`);
            if (res.status === 200) {
                const datos = await res.json();
                template.innerText = `[stt/Pelicula]\n[sc/${datos.vote_average.toFixed(1)}]\n\n\n[nd]\n${datos.overview}\n[/nd]`;
                
                document.getElementById('info-poster').src = `https://image.tmdb.org/t/p/w300${datos.poster_path}`;
                document.getElementById('info-title').innerText = datos.title;
                document.getElementById('info-year').innerText = datos.release_date.slice(0,4);
            }
        }
    } catch (error) { console.error("Error al obtener datos:", error); }
}
