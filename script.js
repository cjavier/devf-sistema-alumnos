const nombre = document.getElementById("nombre");
const resultado = document.getElementById("resultado");
let ultimoIdAlumno = 0;
let ultimoIdMateria = 0;
let ultimoIdGrupo = 0; 
let db = {
    alumnos: {},
    materias: {},
    grupos: {},
    calificaciones: [],
};

class Alumno {
  constructor(id, nombre, apellido, edad) {
    this.id = id
    this.nombre = nombre
    this.apellido = apellido
    this.edad = edad
    this.grupos = []
  }
}

class Materia {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.grupos = []; 
      }
}
class Grupo {
    constructor(id, idMateria) {
      this.id = id;
      this.idMateria = idMateria;
      this.alumnos = []; 
    }
  
    inscribirAlumno(idAlumno) {
      if (!this.alumnos.includes(idAlumno)) {
        this.alumnos.push(idAlumno);
      }
    }
  }

  class Calificacion {
    constructor(idAlumno, idGrupo, nota) {
        this.idAlumno = idAlumno; 
        this.idGrupo = idGrupo; 
        this.nota = nota; 
    }
}

// Agregar alumnos
db.alumnos[1] = new Alumno(1, "Pepito", "Perez", 20);
db.alumnos[2] = new Alumno(2, "Juanito", "Lopez", 25);
db.alumnos[3] = new Alumno(3, "Maria", "Garcia", 30);
ultimoIdAlumno = 3;

// Agregar Materias
db.materias[1] = new Materia(1, "Matemáticas");
db.materias[2] = new Materia(2, "Historia");
db.materias[3] = new Materia(3, "Ciencias");
ultimoIdMateria = 3;

// Agregar Grupos
db.grupos[1] = new Grupo(1, 1);
db.grupos[2] = new Grupo(2, 2);
db.grupos[3] = new Grupo(3, 3);
ultimoIdGrupo = 3;

// Inscribir alumnos en grupo
db.grupos[1].inscribirAlumno(1);
db.grupos[1].inscribirAlumno(2);
db.grupos[1].inscribirAlumno(3);
db.grupos[2].inscribirAlumno(1);
db.grupos[2].inscribirAlumno(2);

// Agregar calificaciones alumnos
db.calificaciones.push(new Calificacion(1, 1, 9));
db.calificaciones.push(new Calificacion(1, 2, 8));
db.calificaciones.push(new Calificacion(2, 1, 7));
db.calificaciones.push(new Calificacion(2, 2, 10));

// 
// FUNCIONES GENERALES
//
function calcularUltimoId(objeto) {
  const ids = Object.keys(objeto).map(id => parseInt(id));
  return ids.length ? Math.max(...ids) : 0;
}

function actualizarLocalStorage() {
  localStorage.setItem("db", JSON.stringify(db));
}

// 
// ALUMNOS
//
function crear_alumno() {
  const id = ++ultimoIdAlumno;
  let alumno = new Alumno(id, nombre.value, apellido.value, edad.value) 
  db.alumnos[id] = alumno;
  actualizarLocalStorage();
  console.log("Alumno creado ", alumno);
}


function obtener_alumno_nombre() {
    const nombreBusqueda = document.getElementById("busqueda_alumno_nombre").value;
    console.log("Buscando ", nombreBusqueda);
    const dbCompleta = JSON.parse(localStorage.getItem("db") || "{}");
    const dbStored = dbCompleta.alumnos || {};    
    const alumno = buscar_por_nombre(nombreBusqueda, dbStored);
    
    if (alumno) {
        resultado_alumno_nombre.innerHTML = `
        <div>
          Nombre: ${alumno.nombre}<br>
          Apellido: ${alumno.apellido}<br>
          Edad: ${alumno.edad}<br>
        </div>
      `;
    } else {
      resultado.innerHTML = "<div>Alumno no encontrado</div>";
    }
  }

  function buscar_por_nombre(nombre, dbStored) {
    for (let id in dbStored) {
        if (dbStored[id].nombre === nombre) {
            return dbStored[id];
        }
    }
    return null;
}

function obtener_alumno_apellido() {
    const apellidoBusqueda = document.getElementById("busqueda_alumno_apellido").value;
    console.log("Buscando ", apellidoBusqueda);
    const dbCompleta = JSON.parse(localStorage.getItem("db") || "{}");
    const dbStored = dbCompleta.alumnos || {};    
    const alumno = buscar_por_apellido(apellidoBusqueda, dbStored);
    
    if (alumno) {
        resultado_alumno_apellido.innerHTML = `
        <div>
          Nombre: ${alumno.nombre}<br>
          Apellido: ${alumno.apellido}<br>
          Edad: ${alumno.edad}<br>
        </div>
      `;
    } else {
        resultado_alumno_apellido.innerHTML = "<div>Alumno no encontrado</div>";
    }
  }

  function buscar_por_apellido(apellido, dbStored) {
    for (let id in dbStored) {
        if (dbStored[id].apellido === apellido) {
            return dbStored[id];
        }
    }
    return null;
}

function llenarListaAlumnos() {
    const selectAlumnos = document.getElementById('alumnos-a-inscribir');
    Object.values(db.alumnos).forEach(alumno => {
        let opcion = new Option(`${alumno.nombre} ${alumno.apellido}`, alumno.id);
        selectAlumnos.add(opcion);
    });
}

function inscribir_alumno() {
  const alumnoId = document.getElementById('alumnos-a-inscribir').value;
  const grupoId = document.getElementById('grupos-para-inscribir').value;

  if (db.grupos[grupoId] && db.alumnos[alumnoId]) {
      if (!db.grupos[grupoId].alumnos) {
          db.grupos[grupoId].alumnos = [];
      }
      
      if (!db.grupos[grupoId].alumnos.includes(alumnoId)) {
          db.grupos[grupoId].alumnos.push(alumnoId); 
          alert(`Alumno inscrito en el grupo ${grupoId}`);
      } else {
          alert('El alumno ya está inscrito en este grupo.');
      }
      localStorage.setItem('db', JSON.stringify(db));
  } else {
      alert('No se pudo inscribir al alumno en el grupo.');
  }
}

  function actualizarAlumnosEnGrupoActivo() {
    const grupoSeleccionado = document.getElementById('grupos-activos').value;
    const selectAlumnos = document.getElementById('alumnos-en-grupos-activos');
    selectAlumnos.innerHTML = ''; 
  
    const alumnosEnGrupo = db.grupos[grupoSeleccionado].alumnos;
  
    alumnosEnGrupo.forEach(alumnoId => {
      if(db.alumnos[alumnoId]) { 
        let option = document.createElement('option');
        option.value = alumnoId;
        option.textContent = `${db.alumnos[alumnoId].nombre} ${db.alumnos[alumnoId].apellido}`;
        selectAlumnos.appendChild(option);
      }
    });
  }
  
// 
// GRUPOS
//

function llenarListaGrupos() {
    const selectGrupos = document.getElementById('grupos-activos');
    Object.values(db.grupos).forEach(grupo => {
        let opcion = new Option(`Grupo ${grupo.id}`, grupo.id);
        selectGrupos.add(opcion);
    });

}
function llenarListaGruposInscribir() {
  const selectGrupos = document.getElementById('grupos-para-inscribir');
  Object.values(db.grupos).forEach(grupo => {
      let opcion = new Option(`Grupo ${grupo.id}`, grupo.id);
      selectGrupos.add(opcion);
  });

}
function llenarListaGruposPromedio() {
  const selectGrupos = document.getElementById('grupos-activos-promedio');
  Object.values(db.grupos).forEach(grupo => {
      let opcion = new Option(`Grupo ${grupo.id}`, grupo.id);
      selectGrupos.add(opcion);
  });

}
function llenarListaGruposListas() {
  const selectGrupos = document.getElementById('grupos-activos-lista');
  Object.values(db.grupos).forEach(grupo => {
      let opcion = new Option(`Grupo ${grupo.id}`, grupo.id);
      selectGrupos.add(opcion);
  });

}

function crear_grupo() {
    const materiaId = document.getElementById('materias-disponibles').value;
    const nuevoGrupoId = ++ultimoIdGrupo; 
    db.grupos[nuevoGrupoId] = new Grupo (nuevoGrupoId, materiaId);
    actualizarLocalStorage();
    alert(`Nuevo grupo creado con ID ${nuevoGrupoId} para la materia ID ${materiaId}`);
  }

// 
// MATERIAS
//

function crearMateriaDefault(nombre) {
    const id = ++ultimoIdMateria; 
    let materia = new Materia(id, nombre);
    db.materias[id] = materia; 
    actualizarLocalStorage();
}

function poblarListaDeMaterias() {
    const selectMaterias = document.getElementById('materias-disponibles');
    Object.values(db.materias).forEach(materia => {
      let option = document.createElement('option');
      option.value = materia.id;
      option.textContent = materia.nombre;
      selectMaterias.appendChild(option);
    });
  }

  function crear_materia() {
    const nombreMateria = document.getElementById('nombre-materia').value;
    const nuevaMateriaId = ++ultimoIdMateria;
    db.materias[nuevaMateriaId] = new Materia (nuevaMateriaId, nombreMateria);
    actualizarLocalStorage();
    alert(`Nueva Materia creada con ID ${nuevaMateriaId}`);
  }

// 
// CALIFICACIONES
//

function agregarCalificacion(idAlumno, idGrupo, nota) {
    const calificacion = new Calificacion(idAlumno, idGrupo, parseFloat(nota));
    db.calificaciones.push(calificacion);
    actualizarLocalStorage();
}

function Calificar_alumno() {
    const grupoId = document.getElementById('grupos-activos').value;
    const alumnoId = document.getElementById('alumnos-en-grupos-activos').value;
    const calificacion = document.getElementById('calificacion').value;
    if (!calificacion || calificacion < 0 || calificacion > 10) {
      alert("Por favor, ingresa una calificación válida entre 0 y 10.");
      return;
    }
    const claveCalificacion = `${alumnoId}-${grupoId}`;
    agregarCalificacion(alumnoId, grupoId, calificacion);
    actualizarLocalStorage();
    alert("Calificación asignada con éxito.");
  }

  function obtener_alumno_nombre_promedio() {
    const nombreBusqueda = document.getElementById("busqueda_alumno_promedio").value.trim().toLowerCase();
    let alumnoEncontrado = null;
      for (let id in db.alumnos) {
      let alumno = db.alumnos[id];
      if (alumno.nombre.toLowerCase().includes(nombreBusqueda) || alumno.apellido.toLowerCase().includes(nombreBusqueda)) {
        alumnoEncontrado = alumno;
        console.log(alumnoEncontrado);
        break;
      }
    }
  
    if (alumnoEncontrado) {
      let totalCalificaciones = 0;
      let cantidadCalificaciones = 0;
console.log(db.calificaciones);
      Object.values(db.calificaciones).forEach(calificacion => {
        if (calificacion.idAlumno == parseInt(alumnoEncontrado.id)) {
            totalCalificaciones += calificacion.nota;
            cantidadCalificaciones++;
        }
    });
      
  
      let promedio = cantidadCalificaciones > 0 ? (totalCalificaciones / cantidadCalificaciones).toFixed(2) : "No hay calificaciones";
        document.getElementById("resultado_alumno_promedio").innerHTML = `
        <div>
          Nombre: ${alumnoEncontrado.nombre} ${alumnoEncontrado.apellido}<br>
          Promedio de calificaciones: ${promedio}
        </div>
      `;
    } else {
      document.getElementById("resultado_alumno_promedio").innerHTML = "<div>Alumno no encontrado.</div>";
    }
  }
  
  function obtener_promedio_grupo() {
    const grupoId = document.getElementById('grupos-activos-promedio').value;
    let totalCalificaciones = 0;
    let cantidadCalificaciones = 0;
    db.calificaciones.forEach(calificacion => {
        if (calificacion.idGrupo == parseInt(grupoId)) {
            totalCalificaciones += calificacion.nota;
            cantidadCalificaciones++;
        }
    });
    let promedio = cantidadCalificaciones > 0 ? (totalCalificaciones / cantidadCalificaciones).toFixed(2) : "No hay calificaciones disponibles para este grupo";
    document.getElementById("resultado_promedio_grupo").innerHTML = `
        <div>
            Promedio del grupo ${grupoId}: ${promedio}
        </div>
    `;
}

function obtener_lista_grupo() {
  const grupoId = document.getElementById('grupos-activos-lista').value;
  const resultadoDiv = document.getElementById('resultado_lista_grupo');
    let tabla = `<table border="1">
                  <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Calificación</th>
                  </tr>`;
    db.calificaciones.forEach(calificacion => {
      if (calificacion.idGrupo == parseInt(grupoId)) {
          const alumno = db.alumnos[calificacion.idAlumno];
          if (alumno) {
              tabla += `<tr>
                          <td>${alumno.nombre}</td>
                          <td>${alumno.apellido}</td>
                          <td>${calificacion.nota}</td>
                        </tr>`;
          }
      }
  });
    tabla += `</table>`;
    resultadoDiv.innerHTML = tabla;
}

// 
// EVENTOS
//

document.addEventListener('DOMContentLoaded', (event) => {
    const dbStored = JSON.parse(localStorage.getItem('db'));
  if (dbStored) {
    db = dbStored;
    ultimoIdAlumno = calcularUltimoId(db.alumnos);
    ultimoIdMateria = calcularUltimoId(db.materias);
    ultimoIdGrupo = calcularUltimoId(db.grupos);
  }
  llenarListaAlumnos();
  llenarListaGrupos();
  llenarListaGruposInscribir();
  llenarListaGruposPromedio();
  llenarListaGruposListas();
  poblarListaDeMaterias(); 
});
document.getElementById('grupos-activos').addEventListener('change', actualizarAlumnosEnGrupoActivo);