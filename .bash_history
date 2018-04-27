pkill x
sudo nmcli dev wifi connect "Aleralero68" password "Robotito01"
sudo pacman -Sy reflector
sudo reflector --verbose -l 5 --sort rate --save /etc/pacman.d/mirrorlist 
sudo pacman -S xorg-server xorg-xinit xorg-utils
sudo pacman -S xorg-server xorg-xinit mesa xf86-video-intel vulkan-intel xorg-twm xterm
starx
startx
localectl set-x11-keymap es pc105 nodeadkeys grp:alt_shift_toggle
startx
sudo pacman -S xdg-user-dirs
xdg-user-dirs-update
ls
sudo nano /etc/pacman.conf 
sudo pacman -Sy
sudo pacman -S yaourt
sudo pacman -S aurman
sudo pacman -S yaourt
yaourt -S aurman
aurman -S spotify
sudo pacman -Rns yaourt
aurman -S spotify
aurman -Syyu --aur --devel
clear
sudo pacman -S alsa-utils
clear
sudo pacman -S xbindkeys dunst qutebrowser firefox rxvt-unicode neovim
sudo pacman -S lightdm
aurman -S lightfm-slick-greeter
aurman -S lightdm-slick-greeter
clear
aurman -i3-gaps-next-git i3 blocks-gaps-git i3lock-git
aurman -S i3-gaps-next-git i3 blocks-gaps-git i3lock-git
aurman -S i3-gaps-next-git i3-blocks-gaps-git i3lock-git
aurman -S i3-gaps-next-git i3blocks-gaps-git i3lock-git
clear
sudo nano /etc/lightdm/lightdm.conf 
cp /etc/X11/xinit/xinitrc ~/.xinitrc
clear
nano .xinitrc 
clear
systemctl enable lightdm.service
systemctl start lightdm.service
exit
sudo pacman -S dmenu
exit
sudo pacman -S zsh
chsh -s $(which zsh)
clear
logout
exit
reboot
