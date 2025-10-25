function irAPagina(ruta) {
  window.location.href = ruta;
}

function generarMatriz() {
  const n = parseInt(document.getElementById("n").value);

  let html = "<table id='tablaAsignacion'><tbody>";
  for (let i = 0; i < n; i++) {
    html += "<tr>";
    for (let j = 0; j < n; j++) {
      html += `<td><input type='number' min='0' value='0'></td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table>";

  document.getElementById("tablaContainer").innerHTML = html;
  document.getElementById("acciones").style.display = "block";
}

function resolverAsignacion() {
  const tabla = document.getElementById("tablaAsignacion");
  const filas = tabla.rows.length;
  const columnas = tabla.rows[0].cells.length;

  let costos = [];
  for (let i = 0; i < filas; i++) {
    let fila = [];
    for (let j = 0; j < columnas; j++) {
      fila.push(parseInt(tabla.rows[i].cells[j].children[0].value));
    }
    costos.push(fila);
  }

  // ===== AGREGADO: Mostrar pasos =====
  let pasos = [];
  let matriz = costos.map(row => [...row]); // copia original

  pasos.push(`<h4>Paso 1: Matriz Original</h4>${mostrarMatriz(matriz)}`);

  // --- Reducción por filas ---
  for (let i = 0; i < filas; i++) {
    const minVal = Math.min(...matriz[i]);
    for (let j = 0; j < columnas; j++) matriz[i][j] -= minVal;
  }
  pasos.push(`<h4>Paso 2: Reducción por Filas</h4>${mostrarMatriz(matriz)}`);

  // --- Reducción por columnas ---
  for (let j = 0; j < columnas; j++) {
    let col = matriz.map(row => row[j]);
    const minVal = Math.min(...col);
    for (let i = 0; i < filas; i++) matriz[i][j] -= minVal;
  }
  pasos.push(`<h4>Paso 3: Reducción por Columnas</h4>${mostrarMatriz(matriz)}`);
  // ===== FIN AGREGADO =====

  let asignacion = hungaro(costos);

  // ===== CALCULAR RESULTADOS =====
  let costoTotal = 0;
  let listaAsignaciones = "";
  for (let i = 0; i < asignacion.length; i++) {
    if (asignacion[i] !== -1) {
      costoTotal += costos[i][asignacion[i]];
      listaAsignaciones += `
        <li>Trabajador ${i + 1} → Tarea ${asignacion[i] + 1} 
        (costo: ${costos[i][asignacion[i]]})</li>`;
    }
  }

  let resultadoHTML = `
    <h2>Asignación Óptima</h2>
    <ul>${listaAsignaciones}</ul>
    <p><strong>Costo Total Mínimo:</strong> ${costoTotal}</p>
  `;

  // ===== MOSTRAR PASOS + RESULTADO FINAL =====
  document.getElementById("resultado").innerHTML = `
    <div class='procedimiento'>${pasos.join("<hr>")}</div>
    <hr>
    <div class='resultado-final'>
      <h3>🔹 Resultado Final</h3>
      ${resultadoHTML}
    </div>
  `;
}

/* ===== MÉTODO HÚNGARO ===== */
function hungaro(costos) {
  const n = costos.length;
  let u = Array(n + 1).fill(0);
  let v = Array(n + 1).fill(0);
  let p = Array(n + 1).fill(0);
  let way = Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    let minv = Array(n + 1).fill(Infinity);
    let used = Array(n + 1).fill(false);
    do {
      used[j0] = true;
      let i0 = p[j0], delta = Infinity, j1 = 0;
      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          let cur = costos[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);

    do {
      let j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  let asignacion = Array(n).fill(-1);
  for (let j = 1; j <= n; j++) {
    if (p[j] > 0) asignacion[p[j] - 1] = j - 1;
  }
  return asignacion;
}

// ===== FUNCIÓN PARA MOSTRAR MATRICES =====
function mostrarMatriz(matriz) {
  let html = `<div class="tabla-scroll"><table class="tabla-hungaro"><tbody>`;
  for (let i = 0; i < matriz.length; i++) {
    html += "<tr>";
    for (let j = 0; j < matriz[i].length; j++) {
      html += `<td>${matriz[i][j]}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  return html;
}
