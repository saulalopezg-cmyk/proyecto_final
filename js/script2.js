

function generarTabla() {
  const numVariables = parseInt(document.getElementById("numVariables").value);
  const numRestricciones = parseInt(document.getElementById("numRestricciones").value);

  const container = document.getElementById("tablaContainer");
  container.innerHTML = "";

  let html = "<table><tr><th>Restricción</th>";

  for (let i = 1; i <= numVariables; i++) {
    html += `<th>X${i}</th>`;
  }
  html += "<th>LD</th></tr>";

  for (let r = 1; r <= numRestricciones; r++) {
    html += `<tr><td>R${r}</td>`;
    for (let v = 1; v <= numVariables; v++) {
      html += `<td><input type='number' id='r${r}v${v}' value='0'></td>`;
    }
    html += `<td><input type='number' id='ld${r}' value='0'></td></tr>`;
  }

  html += "<tr><th>Función Objetivo</th>";
  for (let v = 1; v <= numVariables; v++) {
    html += `<td><input type='number' id='fo${v}' value='0'></td>`;
  }
  html += "<td>Z</td></tr>";
  html += "</table>";

  container.innerHTML = html;
  document.getElementById("resolverBtn").style.display = "inline-block";
}

function resolverSimplex() {
  const numVariables = parseInt(document.getElementById("numVariables").value);
  const numRestricciones = parseInt(document.getElementById("numRestricciones").value);
  const tipoOpt = document.getElementById("tipoOpt").value; // "max" o "min"

  let restricciones = [];
  for (let r = 1; r <= numRestricciones; r++) {
    let fila = [];
    for (let v = 1; v <= numVariables; v++) {
      fila.push(parseFloat(document.getElementById(`r${r}v${v}`).value));
    }
    let ld = parseFloat(document.getElementById(`ld${r}`).value);
    restricciones.push({ coef: fila, ld });
  }

  let fo = [];
  for (let v = 1; v <= numVariables; v++) {
    fo.push(parseFloat(document.getElementById(`fo${v}`).value));
  }

  // ---- SIMPLEX ----
  let m = numRestricciones;
  let n = numVariables + m; // variables + holgura
  let procedimiento = "";

  // Construir tabla inicial
  let tableau = [];
  for (let i = 0; i < m; i++) {
    tableau[i] = [...restricciones[i].coef];
    for (let j = 0; j < m; j++) {
      tableau[i].push(i === j ? 1 : 0); // variable de holgura
    }
    tableau[i].push(restricciones[i].ld); // Lado derecho
  }

  // Fila Z
  let filaZ = fo.map(c => tipoOpt === "max" ? -c : c);
  for (let j = 0; j < m; j++) filaZ.push(0);
  filaZ.push(0);
  tableau.push(filaZ);

  procedimiento += `<h3>Tabla Inicial</h3>${mostrarTabla(tableau)}<br>`;

  // Iteraciones
  let iter = 1;
  while (true) {
    let zRow = tableau[m];
    let col = tipoOpt === "max"
      ? zRow.findIndex(x => x < 0)
      : zRow.findIndex(x => x > 0);
    if (col === -1) break;

    let ratios = tableau.slice(0, m).map(row => {
      return row[col] > 0 ? row[n] / row[col] : Infinity;
    });

    let rowIdx = ratios.indexOf(Math.min(...ratios));
    if (ratios[rowIdx] === Infinity) break;

    let pivot = tableau[rowIdx][col];

    procedimiento += `<h4>Iteración ${iter}</h4>`;
    procedimiento += `<p><strong>Columna pivote:</strong> X${col + 1} | <strong>Fila pivote:</strong> R${rowIdx + 1} | <strong>Elemento pivote:</strong> ${pivot.toFixed(3)}</p>`;

    // Normalizar fila pivote
    tableau[rowIdx] = tableau[rowIdx].map(x => x / pivot);

    // Eliminar columna pivote en las demás filas
    for (let i = 0; i <= m; i++) {
      if (i !== rowIdx) {
        let factor = tableau[i][col];
        tableau[i] = tableau[i].map((x, j) => x - factor * tableau[rowIdx][j]);
      }
    }

    procedimiento += mostrarTabla(tableau);
    iter++;
  }

  // Solución final
  let solucion = Array(numVariables).fill(0);
  for (let j = 0; j < numVariables; j++) {
    let col = tableau.map(row => row[j]);
    if (col.filter(x => x === 0).length === m && col.includes(1)) {
      let rowIdx = col.indexOf(1);
      solucion[j] = tableau[rowIdx][n];
    }
  }

  let zOptimo = tableau[m][n];
  if (tipoOpt === "min") zOptimo *= -1;

  // Mostrar resultado final
  document.getElementById("resultado").innerHTML =
    `<p><strong>Tipo de problema:</strong> ${tipoOpt === "max" ? "Maximización" : "Minimización"}</p>
     <p><strong>Solución óptima:</strong> ${solucion.map((v, i) => `X${i + 1} = ${v.toFixed(3)}`).join(", ")}</p>
     <p><strong>Valor óptimo (Z):</strong> ${zOptimo.toFixed(3)}</p>
     <hr>${procedimiento}`;
}

// --- Función para mostrar las tablas de forma responsiva ---
function mostrarTabla(tableau) {
  let html = `
  <div class="tabla-scroll">
    <table class="tabla-simplex">
      <tbody>
  `;
  tableau.forEach((fila) => {
    html += "<tr>";
    fila.forEach((valor) => {
      html += `<td>${valor.toFixed(3)}</td>`;
    });
    html += "</tr>";
  });
  html += `
      </tbody>
    </table>
  </div>`;
  return html;
}
