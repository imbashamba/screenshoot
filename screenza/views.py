# -*- coding:utf-8 -*-
from django.core.files.uploadedfile import UploadedFile
from django.http import HttpResponseBadRequest, HttpResponse
from django.shortcuts import render_to_response
from django.template import Context

import logging
from django.views.decorators.csrf import csrf_exempt
import uuid
from share_app.settings import MEDIA_ROOT

log = logging


def index(request):

    context = Context({
        'rec_list': 1,
        })

    return render_to_response("screenza/index.html",context)

@csrf_exempt
def file_handler(request):
    if request.method == 'POST':
        log.info('received POST to main multiuploader view')
        if request.FILES == None:
            return HttpResponseBadRequest('Must have files attached!')

        #getting file data for farther manipulations
        file = request.FILES[u'files']
        wrapped_file = UploadedFile(file)
        filename = wrapped_file.name.encode('utf-8')
        file_size = wrapped_file.file.size
        log.info ('Got file: "%s"' % str(filename))
        log.info('Content type: "$s" % file.content_type')
        filename = '{0}.png'.format(uuid.uuid4())
        handle_uploaded_file(file,filename)
        return HttpResponse('/media/{0}'.format(filename))

def handle_uploaded_file(f, fname):
    with open(MEDIA_ROOT+'/'+fname, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)