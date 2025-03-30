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
        const empresa = await Empresa.findOne({ nombreEmpresa, clave });
        if (!empresa) {
            return res.status(401).json({ message: 'Clave incorrecta' });
        }
        if (empresa.contador >= empresa.muestraRepresentativa) {
            return res.status(403).json({ message: 'Se ha alcanzado el límite de la muestra representativa' });
        }
        empresa.contador += 1;
        await empresa.save();
        res.status(200).json({ message: 'Clave correcta', empresaId: empresa._id, contador: empresa.contador });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar la clave', error });
    }
};

// Obtener todas las empresas
exports.getEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.find();
        res.status(200).json(empresas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las empresas', error });
    }
};

// Obtener una empresa por ID
exports.getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.params.id);
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json(empresa);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la empresa', error });
    }
};

// Actualizar una empresa por ID
exports.updateEmpresa = async (req, res) => {
    try {
        const { nombreEmpresa, cantidadEmpleados, clave } = req.body;
        const empresaActualizada = await Empresa.findByIdAndUpdate(
            req.params.id,
            { nombreEmpresa, cantidadEmpleados, clave },
            { new: true }
        );
        if (!empresaActualizada) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json(empresaActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la empresa', error });
    }
};

// Eliminar una empresa por ID
exports.deleteEmpresa = async (req, res) => {
    try {
        const empresaEliminada = await Empresa.findByIdAndDelete(req.params.id);
        if (!empresaEliminada) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json({ message: 'Empresa eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la empresa', error });
    }
};