import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ingredient {
  name: string;
  required: number;
  unit: string;
}

interface NewFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formula: any) => void;
}

export const NewFormulaModal = ({ isOpen, onClose, onSave }: NewFormulaModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    batchSize: "",
    estimatedTime: "",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", required: 0, unit: "kg" }
  ]);

  const categories = [
    "Floral",
    "Cítrica", 
    "Amaderada",
    "Oriental",
    "Fresca",
    "Dulce"
  ];

  const units = ["kg", "L", "ml", "g"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: "", required: 0, unit: "kg" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    // Validar campos requeridos
    if (!formData.name || !formData.description || !formData.category || !formData.batchSize) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Validar ingredientes
    const validIngredients = ingredients.filter(ing => ing.name.trim() !== "" && ing.required > 0);
    if (validIngredients.length === 0) {
      alert("Debe agregar al menos un ingrediente válido");
      return;
    }

    // Generar ID único
    const newId = `F${String(Date.now()).slice(-3)}`;

    const newFormula = {
      id: newId,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      batchSize: parseInt(formData.batchSize),
      status: "incomplete",
      estimatedTime: formData.estimatedTime || "4 horas",
      ingredients: validIngredients.map(ing => ({
        ...ing,
        available: 0 // Por defecto no hay stock disponible
      }))
    };

    onSave(newFormula);
    
    // Resetear formulario
    setFormData({
      name: "",
      description: "",
      category: "",
      batchSize: "",
      estimatedTime: "",
    });
    setIngredients([{ name: "", required: 0, unit: "kg" }]);
    onClose();
  };

  const handleClose = () => {
    // Resetear formulario al cerrar
    setFormData({
      name: "",
      description: "",
      category: "",
      batchSize: "",
      estimatedTime: "",
    });
    setIngredients([{ name: "", required: 0, unit: "kg" }]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary" />
            Nueva Fórmula
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Fórmula *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Lavanda Premium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchSize">Tamaño del Lote (kg) *</Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={formData.batchSize}
                  onChange={(e) => handleInputChange("batchSize", e.target.value)}
                  placeholder="50"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tiempo Estimado</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                  placeholder="4 horas"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe las características de esta fórmula..."
                rows={3}
              />
            </div>
          </div>

          {/* Ingredientes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Ingredientes</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Ingrediente
              </Button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Nombre del Ingrediente</Label>
                      <Input
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        placeholder="Ej: Aceite Esencial de Lavanda"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Cantidad Requerida</Label>
                      <Input
                        type="number"
                        value={ingredient.required}
                        onChange={(e) => handleIngredientChange(index, "required", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Unidad</Label>
                      <Select 
                        value={ingredient.unit} 
                        onValueChange={(value) => handleIngredientChange(index, "unit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Crear Fórmula
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
