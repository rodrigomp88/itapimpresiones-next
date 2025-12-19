import { render, screen } from '@testing-library/react';
import ProductItem from '../components/Product/ProductItem';
import { Product } from '../types';

// Mock de Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock de Next.js Image
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />;
});

// Mock de framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

const mockProduct: Product = {
  id: '1',
  name: 'Producto de Prueba',
  slug: 'producto-prueba',
  price: 1000,
  images: [{ url: '/test-image.jpg', color: 'Todos' }],
  pause: false,
  unity: 1,
  size: 'M',
  category: 'Test',
  description: 'Descripción de prueba',
  createdAt: '2025-01-01',
  stock: 100,
  stockType: 'physical',
};

describe('ProductItem', () => {
  it('should render product name and price', () => {
    render(<ProductItem {...mockProduct} />);

    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    expect(screen.getByText('$1.000')).toBeInTheDocument();
  });

  it('should render "Sin Stock" when paused', () => {
    render(<ProductItem {...mockProduct} pause={true} />);

    expect(screen.getByText('Sin Stock')).toBeInTheDocument();
  });

  it('should render link with correct href', () => {
    render(<ProductItem {...mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/producto/producto-prueba');
  });

  it('should render description', () => {
    render(<ProductItem {...mockProduct} />);

    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
  });
});
