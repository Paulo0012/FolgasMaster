import os
from pathlib import Path
from datetime import timedelta
import dotenv

# ------------------------------------------------------------------
# 0. INICIALIZAÇÃO E CARREGAMENTO DO .ENV
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# CARREGA O ARQUIVO .ENV (Isso é o que faltava!)
dotenv.load_dotenv(os.path.join(BASE_DIR, '.env'))

# Tenta ler do .env. Se falhar, usa valores padrão para não travar o servidor.
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    # Fallback temporário para evitar o erro "must not be empty"
    SECRET_KEY = 'django-insecure-chave-padrao-temporaria-mude-no-env'

DEBUG = os.getenv('DEBUG', 'True') == 'True'

# Lê os hosts permitidos (Default: localhost)
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ------------------------------------------------------------------
# 1. APLICAÇÕES INSTALADAS
# ------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Bibliotecas Necessárias para a API e React
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    
    # Seu App
    'servidores',
]

# ------------------------------------------------------------------
# 2. MIDDLEWARE
# ------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Deve vir antes do Common
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'folgasprojeto.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'servidores/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'folgasprojeto.wsgi.application'

# ------------------------------------------------------------------
# 3. BASE DE DADOS
# ------------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ------------------------------------------------------------------
# 4. CONFIGURAÇÃO DE CORS (PERMISSÃO PARA O REACT)
# ------------------------------------------------------------------
# Pega a URL do React do .env ou usa o padrão do Vite
CORS_ALLOWED_ORIGINS = [
    os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173'),
]

# ------------------------------------------------------------------
# 5. REST FRAMEWORK & JWT
# ------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ------------------------------------------------------------------
# 6. INTERNACIONALIZAÇÃO E ARQUIVOS
# ------------------------------------------------------------------
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Redirecionamento de Login (Templates legados)
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login'