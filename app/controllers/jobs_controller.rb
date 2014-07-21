class JobsController < ApplicationController

	def index
		@jobs = Job.all
	end

	def new
		@job = Job.new
	end

	def create
		authenticate_employer!
		@job = Job.create(params[:job].permit(:name, :category, :company, :full_time, :detail, :location, :pay, :email, :phone))
		redirect_to '/jobs'
	end
end
