import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  activeTab = 'platos';

  categories = [
    { key: 'platos', label: 'Platos Principales' },
    { key: 'bar',    label: 'Bar y Barismo'       }
  ];

  platos = [
    {
      name: 'Filete de Salmón a la Plancha',
      desc: 'Con vegetales salteados, puré de papa trufa y salsa de mantequilla cítrica',
      price: 35000,
      category: 'Gourmet',
      img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80'
    },
    {
      name: 'Risotto de Hongos Silvestres',
      desc: 'Arroz arbóreo cremoso con mezcla de hongos, parmesano y aceite de trufa',
      price: 28000,
      category: 'Especial',
      img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80'
    },
    {
      name: 'Lomo de Res a la Brasa',
      desc: 'Corte premium marinado, papas rústicas y chimichurri artesanal',
      price: 42000,
      category: 'Premium',
      img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80'
    },
    {
      name: 'Pechuga Rellena de Espinaca',
      desc: 'Salsa de hongos, puré de batata y ensalada verde',
      price: 26000,
      category: 'Clásico',
      img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80'
    }
  ];

  cafes = [
    { name: 'Espresso Colombiano',  desc: 'Granos premium de Huila', price: 4500  },
    { name: 'Cappuccino Artesanal', desc: 'Con arte latte',           price: 6000  },
    { name: 'Latte Macchiato',      desc: 'Con leche vaporizada',     price: 6500  },
    { name: 'Café de Filtro V60',   desc: 'Método japonés',           price: 7000  }
  ];

  bebidas = [
    { name: 'Mojito SENA',          desc: 'Con hierbabuena fresca',  price: 12000 },
    { name: 'Aguapanela con Limón', desc: 'Bebida tradicional',       price: 5000  },
    { name: 'Limonada de Coco',     desc: 'Refrescante y natural',    price: 8000  },
    { name: 'Smoothie Tropical',    desc: 'Mango, piña y maracuyá',   price: 9000  }
  ];
}
