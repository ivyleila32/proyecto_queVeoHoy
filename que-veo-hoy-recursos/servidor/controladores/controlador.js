const conn = require('../lib/conexionbd');

conn.connect(function (err) {
    if (err) throw err;
    console.log("Conectado a Mysql!");
});

module.exports = {
    getPeliculas,
    getGeneros,
};

function getPeliculas(req, res) {
    
    const filtroAnio = req.query.anio ? `p.anio = ${parseInt(req.query.anio)}` : '1 = 1';
    const filtroTitulo = req.query.titulo ?`p.titulo like "%${req.query.titulo}%"` : '1 = 1';
    const filtroGenero = req.query.genero ?`p.genero_id = ${parseInt(req.query.genero)}` : '1 = 1';
    const tipoOrden = req.query.tipo_orden ? req.query.tipo_orden : '';
    const orderBy = req.query.columna_orden ? `order by ${req.query.columna_orden} ${tipoOrden}` : '';
    const tamanioPag = parseInt(req.query.cantidad);
    const nroPagina = parseInt(req.query.pagina);
    const offset = tamanioPag * (nroPagina - 1);
    const filtro = `
        ${filtroAnio}   AND
        ${filtroTitulo} AND
        ${filtroGenero}
        
        
    `;
    const sql = `
        select p.* 
        from pelicula as p
        inner join genero as g on g.id = p.genero_id
        where  ${filtro}   
        ${orderBy} 
        limit ${tamanioPag}
        offset ${offset}
    `;

    

    console.log(sql);

    conn.query(sql, (err, result) => {
        if (err) throw err;
        const resultado = {
            peliculas: result,
            total: 0,
        };
        const sqlTotal = `select count(*) as total from pelicula as p where ${filtro}`;
        conn.query(sqlTotal, (err, result) => { 
            if (err) throw err;
            const fila = result.pop();
            resultado.total = fila.total ? fila.total : 0;
            res.json(resultado);
        });
    });
}

function getGeneros(req, res) {
    const sql = 'select * from genero';
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.json({
            generos: result,
        });
    });
}
