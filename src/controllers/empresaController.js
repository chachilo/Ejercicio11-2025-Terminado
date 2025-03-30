const Empresa = require('../models/empresa');

// Crear una nueva empresa
exports.createEmpresa = async (req, res) => {
    try {
        const { nombreEmpresa, cantidadEmpleados, clave, muestraRepresentativa } = req.body;
        const nuevaEmpresa = new Empresa({
            nombreEmpresa,
            cantidadEmpleados,
            clave,
            muestraRepresentativa
        });
        const empresaGuardada = await nuevaEmpresa.save();
        res.status(201).json(empresaGuardada);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la empresa', error });
    }
};

// Verificar la clave de la empresa y actualizar el contador
exports.verifyClave = async (req, res) => {
    try {
      const { nombreEmpresa, clave } = req.body;
      
      if (!nombreEmpresa || !clave) {
        return res.status(400).json({
          success: false,
          message: 'Nombre y clave son requeridos'
        });
      }
  
      const empresa = await Empresa.findOne({ nombreEmpresa, clave });
      
      if (!empresa) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
  
      if (empresa.contador >= empresa.muestraRepresentativa) {
        return res.status(403).json({
          success: false,
          message: 'Límite de encuestas alcanzado'
        });
      }
  
      // Incrementar contador
      empresa.contador += 1;
      await empresa.save();
  
      res.json({
        success: true,
        message: 'Acceso autorizado',
        empresaId: empresa._id,
        contadorActual: empresa.contador
      });
  
    } catch (error) {
      console.error('Error en verifyClave:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor',
        error: error.message
      });
    }
  };

exports.getAllEmpresas = async (req, res) => {
    try {
        console.log('Consultando empresas en DB...');
        const empresas = await Empresa.find({}, 'nombreEmpresa _id cantidadEmpleados');
        console.log('Empresas encontradas:', empresas.length);
        
        res.status(200).json({
            success: true,
            count: empresas.length,
            data: empresas
        });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener empresas',
            error: error.message
        });
    }
};
