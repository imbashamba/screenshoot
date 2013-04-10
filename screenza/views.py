# -*- coding:utf-8 -*-
from django.http import HttpResponseBadRequest, HttpResponse
from django.shortcuts import render_to_response
from django.template import Context

from django.views.decorators.csrf import csrf_exempt
import uuid
from share_app.settings import MEDIA_ROOT



def index(request):

    context = Context({
        'rec_list': 1,
        })

    return render_to_response("screenza/index.html",context)

@csrf_exempt
#разбираем пост
def file_handler(request):
    if request.method == 'POST':
        if request.FILES == None:
            return HttpResponseBadRequest(u'Отсутствуют файлы')

        file = request.FILES[u'files']

        filename = '{0}.png'.format(uuid.uuid4())
        handle_uploaded_file(file,filename)
        return HttpResponse('/media/{0}'.format(filename))

#сохраняем файлик
def handle_uploaded_file(f, fname):
    with open(MEDIA_ROOT+'/'+fname, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)