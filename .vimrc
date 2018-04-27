" Filetype Detection
filetype plugin indent on

" Syntax Highlighting
if !exists('g:syntax_on')
	syntax enable
endif

" Leader Keys
let g:mapleader = "\<Space>"
let g:maplocalleader = '\'

" Disable unused built-in plugins.
let g:loaded_gzip = v:true
let g:loaded_rrhelper = v:true
let g:loaded_tarPlugin = v:true
let g:loaded_zipPlugin = v:true
let g:loaded_netrwPlugin = v:true
let g:loaded_netrwFileHandlers = v:true
let g:loaded_netrwSettings = v:true
let g:loaded_2html_plugin = v:true
let g:loaded_vimballPlugin = v:true
let g:loaded_getscriptPlugin = v:true
let g:loaded_logipat = v:true
let g:loaded_man = v:true
let g:loaded_tutor_mode_plugin = v:true
let g:loaded_matchit = v:true

" Plugin.
call plug#begin('~/.local/share/nvim/plugged')

	" Source all files under package directory.
	for s:package in split(glob('~/.config/nvim/package/*.vim'), '\n')
		if filereadable(s:package)
			execute 'source' s:package
		endif
	endfor

Plug 'cocopon/iceberg.vim'	
Plug 'ctrlpvim/ctrlp.vim'
Plug 'dikiaap/minimalist'
Plug 'junegunn/vim-plug'
Plug 'tpope/vim-fugitive'
Plug 'vim-airline/vim-airline'
call plug#end()

set guifont=Hack
colorscheme iceberg


