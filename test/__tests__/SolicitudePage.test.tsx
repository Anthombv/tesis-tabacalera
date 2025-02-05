// Importar bibliotecas y el componente a probar
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import { useAuth } from '../../lib/hooks/use_auth';
import HttpClient from '../../lib/utils/http_client';
import SolicitudePage from '../../pages/solicitude';

// Mockear las dependencias
jest.mock('../../../lib/hooks/use_auth');
jest.mock('../../../lib/utils/http_client');

describe('SolicitudePage Component', () => {
  const mockAuth = { userName: 'testUser', role: 'admin' };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ auth: mockAuth }); // Simula un usuario autenticado
  });

  it('renders the page title', () => {
    // Renderiza el componente
    render(<SolicitudePage dates={[]} />);

    // Verifica que el título aparece en el DOM
    expect(
      screen.getByText('Historial de contenedores enviados')
    ).toBeInTheDocument();
  });

  it('fetches and displays data correctly', async () => {
    // Simula datos que la API regresaría
    const mockData = [
      { id: 1, number: '001', fecha: '2023-01-01', solicitante: 'John Doe' },
    ];

    (HttpClient as jest.Mock).mockResolvedValue({ data: mockData });

    // Renderiza el componente
    render(<SolicitudePage dates={[]} />);

    // Espera y verifica que los datos simulados aparezcan
    await waitFor(() => {
      expect(screen.getByText('001')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
