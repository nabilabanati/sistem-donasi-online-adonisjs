import type { HttpContext } from '@adonisjs/core/http'
import Donatur from '#models/donatur'

export default class DonatursController {
    public async index({ view }: HttpContext) {
        const donaturs = await Donatur.all()
        return view.render('pages/donatur/index', { donaturs })
    }
    
    public async create({ view }: HttpContext) {
        return view.render('pages/donatur/create')
    }
    
    public async save({ request, response }: HttpContext) {
        const data = request.only(['nama', 'email', 'telepon'])
        await Donatur.create(data)
        response.redirect().toRoute('donatur.index')
    }
    
    public async show({ view, params }: HttpContext) {
        const donatur = await Donatur.findOrFail(params.id)
        return view.render('pages/donatur/show', { donatur })
    }
    
    public async edit({ view, params }: HttpContext) {
        const donatur = await Donatur.findOrFail(params.id)
        return view.render('pages/donatur/edit', { donatur })
    }
    
    public async update({ request, response, params }: HttpContext) {
        const donatur = await Donatur.findOrFail(params.id)
        const data = request.only(['nama', 'email', 'telepon'])
        donatur.merge(data)
        await donatur.save()
        response.redirect().toRoute('donatur.index')
    }
    
    public async destroy({ response, params }: HttpContext) {
        const donatur = await Donatur.findOrFail(params.id)
        await donatur.delete()
        response.redirect().toRoute('donatur.index')
    }
}
