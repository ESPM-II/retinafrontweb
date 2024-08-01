
export const siglas = (nombreCompleto) => {
    const palabras = nombreCompleto.split(" ");
    let iniciales = "";

    for (const palabra of palabras.slice(0, 2)) {
    iniciales += palabra[0].toUpperCase();
    }

    return iniciales;
}