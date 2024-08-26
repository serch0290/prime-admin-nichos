/**
 * Función para limpiar una cadena de texto
 */
export function cleanText(cadena: string): string {
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,";
    // Definimos los caracteres que queremos eliminar
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,";

    for (var j = 0; j < specialChars.length; j++) {
        cadena = cadena.replace(new RegExp("\\" + specialChars[j], 'gi'), '');
    }

    cadena = cadena.replace(/ /g, "_");

    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");

    cadena = cadena.replace(/Á/gi, "A");
    cadena = cadena.replace(/É/gi, "E");
    cadena = cadena.replace(/Í/gi, "I");
    cadena = cadena.replace(/Ó/gi, "O");
    cadena = cadena.replace(/Ú/gi, "U");
    cadena = cadena.replace(/Ñ/gi, "N");
    cadena = cadena.replace(/'/gi, "");

    cadena = cadena.replace(/́/g, "");
    cadena = cadena.replace(/̃/g, "");

    // JAVV: Reemplazamos repeticiones de _ por uno solo
    cadena = cadena.replace(/_+/g, '_');
    return cadena.toLowerCase();
}
