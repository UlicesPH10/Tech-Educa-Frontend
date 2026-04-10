# 🎓 EduGuard Frontend - Monitoreo Académico Corporativo

Este es el repositorio oficial del Frontend de **EduGuard**, una plataforma integral de tecnología educativa (EdTech) diseñada para optimizar la trazabilidad y la tutoría de estudiantes a través del análisis de asistencia, rendimiento y comportamiento en tiempo real. 

Esta interfaz web es la pieza visual y operativa que consume el ecosistema backend (FastAPI + IA), garantizando una experiencia de usuario estéticamente corporativa y altamente funcional.

## ✨ Características Principales
*   **Diseño Profesional (*Clean Corporate*):** Paleta de colores serena, estructura clara y uso de elementos visuales (glassmorphism y sombras sutiles) orientados a maximizar la ergonomía y usabilidad para la administración educativa.
*   **Gestión Basada en Roles:**
    *   **Administrador:** Pantalla general de dashboards e indicadores de escuela, así como asignación de alertas.
    *   **Docente:** Gestor integral de asignaturas, control de su tira curricular y módulos de captura para pases de lista (asistencia) y evaluaciones (calificaciones).
    *   **Estudiante:** Perfil enriquecido para visualizar calificaciones desglozadas, score global de conducta, y una bitácora interactiva formatizada en *Timeline* donde se auditan reportes académicos e incidencias conductuales.
    *(Nota: La Interfaz web está reservada únicamente para operaciones institucionales, los Tutores y Padres de Familia se enlazan de forma paralela usando IA Conversacional a través de Telegram).*
*   **KPIs en Tiempo Real:** Las visualizaciones de gráficas y los "Risk Gauges" se sincronizan para detectar en milisegundos si un estudiante sufre caídas preocupantes en su desempeño.

## 🛠️ Stack Tecnológico
*   **Framework Principal:** [React](https://react.dev/) v18
*   **Herramienta de Construcción:** [Vite](https://vitejs.dev/)
*   **Estilización:** [Tailwind CSS](https://tailwindcss.com/)
*   **Enrutamiento:** [React Router v6](https://reactrouter.com/)
*   **Iconografía UI:** [Lucide React](https://lucide.dev/)
*   **Manejo de Formularios:** React Hook Form
*   **Cliente HTTP:** Axios (Autenticación transparente con JWT Data en cada endpoint)
*   **Gráficos Analíticos:** Recharts

## 🚀 Requisitos Previos e Instalación

Necesitarás al menos [Node.js](https://nodejs.org/) v18+ instalado en tu entorno local.

1.  **Clona este repositorio:**
    ```bash
    git clone https://github.com/UlicesPH10/Tech-Educa-Frontend.git
    cd Tech-Educa-Frontend
    ```

2.  **Instala los paquetes o dependencias de NPM:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz de tu proyecto tomando de referencia el URL de la API del Backend.
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```

4.  **Ejecuta el Servidor de Desarrollo Rápido:**
    ```bash
    npm run dev
    ```
    Visita `http://localhost:5173` o el puerto que indique la consola en tu navegador.

## 🤝 Conectividad a Endpoints
El sistema reacciona dinámicamente conectando cada rol con los diferentes bloques funcionales de datos:
- `/auth/login` - Módulo criptográfico para inicios de sesión.
- `/estudiantes/me/*` - Perfilamiento y listado de materias individualizado.
- `/materias/docente/me` - Tiras curriculares.
- Endpoints de *Registros de Notas y Faltas en lote*, configurados al robusto sistema modular diseñado en FastAPI.

---
🚀 *Desarrollado para la solución de Hackathon 'Reto 1' - Educación Inteligente*
