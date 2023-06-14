# ! /usr/bin/env python
# -*- coding: utf-8 -*-
# Copyright(c) 2018 Toshiba Tec Corporation, All Rights Reserved.

from pyramid.config import Configurator


def includeme(config):
    config.add_route("POST_Transfer", "POST_Transfer", xhr=True)
    config.add_route("POST_CreateDID", "POST_CreateDID", xhr=True)
    config.add_route("activate_unid", "activate_unid", xhr=True)
    config.add_route("kill_unid", "kill_unid", xhr=True)


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    config = Configurator(settings=settings)
    config.add_renderer('jsonp', JSONP(param_name='callback'))
    config.include(includeme, route_prefix='/')
    config.scan()
    return config.make_wsgi_app()