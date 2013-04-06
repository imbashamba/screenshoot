from django.conf.urls import patterns, url, include

from screenza import views

urlpatterns = patterns('',
                       url(r'^$', views.index, name='index'),
                       url(r'^upload/', views.file_handler, name='file_handler'),
                       )