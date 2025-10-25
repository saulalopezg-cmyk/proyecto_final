function generarTabla() {
  const numOrigenes = parseInt(document.getElementById("numOrigenes").value);
  const numDestinos = parseInt(document.getElementById("numDestinos").value);

  const container = document.getElementById("tablaContainer");
  container.innerHTML = "";

  let html = `
    <div class="tabla-scroll">
      <table class="tabla-transporte">
        <tr><th>Origen/Destino</th>`;

  for (let j = 1; j <= numDestinos; j++) {
    html += `<th>D${j}</th>`;
  }
  html += "<th>Oferta</th></tr>";

  for (let i = 1; i <= numOrigenes; i++) {
    html += `<tr><td>O${i}</td>`;
    for (let j = 1; j <= numDestinos; j++) {
      html += `<td><input type='number' id='c${i}${j}' value='0'></td>`;
    }
    html += `<td><input type='number' id='oferta${i}' value='0'></td></tr>`;
  }

  html += "<tr><td>Demanda</td>";
  for (let j = 1; j <= numDestinos; j++) {
    html += `<td><input type='number' id='demanda${j}' value='0'></td>`;
  }
  html += "<td>-</td></tr></table></div>";

  container.innerHTML = html;
  document.getElementById("resolverBtn").style.display = "inline-block";
}

function resolverTransporte() {
  const numOrigenes = parseInt(document.getElementById("numOrigenes").value);
  const numDestinos = parseInt(document.getElementById("numDestinos").value);
  const tipo = document.getElementById("tipoProblema").value;

  let costos = [], oferta = [], demanda = [];

  // Leer datos de entrada
  for (let i = 0; i < numOrigenes; i++) {
    costos[i] = [];
    for (let j = 0; j < numDestinos; j++) {
      costos[i][j] = parseFloat(document.getElementById(`c${i+1}${j+1}`).value);
      if (tipo === "max") costos[i][j] *= -1; // convertir a minimización
    }
    oferta[i] = parseFloat(document.getElementById(`oferta${i+1}`).value);
  }

  for (let j = 0; j < numDestinos; j++) {
    demanda[j] = parseFloat(document.getElementById(`demanda${j+1}`).value);
  }

  // --- Método de la Esquina Noroeste ---
  let asignacion = Array.from({ length: numOrigenes }, () => Array(numDestinos).fill(0));
  let i = 0, j = 0;
  let pasos = [];

  while (i < numOrigenes && j < numDestinos) {
    let cantidad = Math.min(oferta[i], demanda[j]);
    asignacion[i][j] = cantidad;

    pasos.push(
      `Se asigna <b>${cantidad}</b> unidades en la celda <b>O${i+1}-D${j+1}</b> (costo = ${Math.abs(costos[i][j])}).<br>` +
      `Oferta restante O${i+1}: ${oferta[i] - cantidad}, Demanda restante D${j+1}: ${demanda[j] - cantidad}.`
    );

    oferta[i] -= cantidad;
    demanda[j] -= cantidad;

    if (oferta[i] === 0 && demanda[j] === 0) {
      pasos.push("Tanto la oferta como la demanda se agotaron; se mueve a la siguiente fila.");
      i++;
      j++;
    } else if (oferta[i] === 0) {
      pasos.push(`La oferta de O${i+1} se agotó, se pasa al siguiente origen.`);
      i++;
    } else if (demanda[j] === 0) {
      pasos.push(`La demanda de D${j+1} se agotó, se pasa al siguiente destino.`);
      j++;
    }
  }

  // Calcular costo total
  let z = 0;
  let detalle = `
    <div class="tabla-scroll">
      <table class="tabla-transporte">
        <tr><th>O/D</th>`;

  for (let d = 1; d <= numDestinos; d++) detalle += `<th>D${d}</th>`;
  detalle += "</tr>";

  for (let i = 0; i < numOrigenes; i++) {
    detalle += `<tr><td>O${i+1}</td>`;
    for (let j = 0; j < numDestinos; j++) {
      if (asignacion[i][j] > 0) {
        detalle += `<td>${asignacion[i][j]} × ${Math.abs(costos[i][j])}</td>`;
        z += asignacion[i][j] * costos[i][j];
      } else {
        detalle += "<td>-</td>";
      }
    }
    detalle += "</tr>";
  }
  detalle += "</table></div>";

  let resultadoFinal = (tipo === "max") 
    ? `<b>Beneficio Total (Z) = ${-z}</b>` 
    : `<b>Costo Total (Z) = ${z}</b>`;

  // Mostrar resultados
  document.getElementById("resultado").innerHTML = `
    <h3>Procedimiento del Método de la Esquina Noroeste</h3>
    <div class="pasos">
      ${pasos.map(p => `<p>${p}</p>`).join("")}
    </div>
    <h3>Solución Final</h3>
    ${detalle}
    <p>${resultadoFinal}</p>
  `;
}
