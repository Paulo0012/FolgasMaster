import os
from pathlib import Path
from datetime import timedelta
import dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Use os dados do .env
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG') == 'True'
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
    
    # Seu App do GTE
    'servidores',
]

# ------------------------------------------------------------------
# 2. MIDDLEWARE
# ------------------------------------------------------------------
MIDDLEWARE = [
    # O CorsMiddleware DEVE vir antes do CommonMiddleware
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
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
# 3. BASE DE DADOS (SQLite na Raiz do Backend)
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
# Permite que o Frontend (Vite/React) acesse a API do Django
CORS_ALLOWED_ORIGINS = [
    os.getenv('CORS_ALLOWED_ORIGINS'),
]

# ------------------------------------------------------------------
# 5. OUTRAS CONFIGURAÇÕES
# ------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# Arquivos Estáticos e de Mídia (Fotos)
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Redirecionamento de Login (Templates)
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'login'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', # Protege a API por padrão
    ],
}

SIMPLE_JWT = {
    # Tempo de expiração do Token de Acesso (agora 30 dias)
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30), 
    
    # Tempo de expiração do Token de Refresh (geralmente maior ou igual)
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True, # Útil para auditoria no Admin
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}