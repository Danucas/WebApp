self.addEventListener('install', function(event){
	event.waitUntil(
        caches.open('med_deli_cache_icons').then(function(cache){
            console.log('caching');
            return cache.addAll(
                    [
                        '/src/favicon.ico',
                        '/src/app_banner.png',
                        '/src/app_banner_mob.png',
                        '/src/icons/progress_gif.gif',
                        '/src/icons/wait.gif' ,
                        '/src/icons/wait_gif.gif' ,
                        '/src/icons/add_more.png' ,
                        '/src/icons/arrived.png' ,
                        '/src/icons/back.png' ,
                        '/src/icons/background.png' ,
                        '/src/icons/back_button.png' ,
                        '/src/icons/back_canasta.png' ,
                        '/src/icons/back_main.png' ,
                        '/src/icons/back_main_land.png' ,
                        '/src/icons/back_main_land.png' ,
                        '/src/icons/banner_canasta.png' ,
                        '/src/icons/banner_grupo.png' ,
                        '/src/icons/bell.png' ,
                        '/src/icons/btn_back.png' ,
                        '/src/icons/btn_back_arrow.png' ,
                        '/src/icons/btn_back_arrow_grey.png' ,
                        '/src/icons/btn_back_arrow_orange.png' ,
                        '/src/icons/btn_chat.png' ,
                        '/src/icons/btn_facebook.png' ,
                        '/src/icons/btn_instagram.png' ,
                        '/src/icons/btn_pinterest.png' ,
                        '/src/icons/btn_right_arrow.png' ,
                        '/src/icons/btn_right_arrow_grey.png' ,
                        '/src/icons/btn_right_arrow_orange.png' ,
                        '/src/icons/btn_youtube.png' ,
                        '/src/icons/cal_icon.png' ,
                        '/src/icons/cambiar_ic.png' ,
                        '/src/icons/cancel_btn.png' ,
                        '/src/icons/cancel_btn_grey.png' ,
                        '/src/icons/cancel_btn_orange.png' ,
                        '/src/icons/candel.png' ,
                        '/src/icons/chat_icon.png' ,
                        '/src/icons/clock.png' ,
                        '/src/icons/cupon_box.png' ,
                        '/src/icons/cupon_box_clear.png' ,
                        '/src/icons/cupon_box_gold.png' ,
                        '/src/icons/cupon_box_used.png' ,
                        '/src/icons/cupon_gold_icon.png' ,
                        '/src/icons/cupon_menu_icon.png' ,
                        '/src/icons/cupon_menu_icon_acent.png' ,
                        '/src/icons/cupon_menu_icon_yellow.png' ,
                        '/src/icons/down_arrow.png' ,
                        '/src/icons/edit_wand.png' ,
                        '/src/icons/footer_logo.png' ,
                        '/src/icons/exclamation_point.png' ,
                        '/src/icons/footer_logo.png' ,
                        '/src/icons/google-play-badge.png' ,
                        '/src/icons/grano_derecha.png' ,
                        '/src/icons/grano_derecha_null.png' ,
                        '/src/icons/grano_derecha_ok.png' ,
                        '/src/icons/grano_izquierda.png' ,
                        '/src/icons/grano_izquierda_null.png' ,
                        '/src/icons/grano_izquierda_ok.png' ,
                        '/src/icons/green_point.png' ,
                        '/src/icons/ham_icon.png' ,
                        '/src/icons/ham_icon_black.png' ,
                        '/src/icons/ham_icon_orange.png' ,
                        '/src/icons/has_child_point.png' ,
                        '/src/icons/iconos_adm_01.png' ,
                        '/src/icons/iconos_adm_02.png' ,
                        '/src/icons/icono_reserva.png' ,
                        '/src/icons/icon_buzon.png' ,
                        '/src/icons/ic_chat.png' ,
                        '/src/icons/ic_grupo.png' ,
                        '/src/icons/information_point.png' ,
                        '/src/icons/launcher.png' ,
                        '/src/icons/launcher_logo.png' ,
                        '/src/icons/left_arrow.png' ,
                        '/src/icons/logo.png' ,
                        '/src/icons/logotipo.png' ,
                        '/src/icons/log_out.png' ,
                        '/src/icons/marker_user.png' ,
                        '/src/icons/menu_ic_grey.png' ,
                        '/src/icons/menu_ic_orange.png' ,
                        '/src/icons/menu_ic_white.png' ,
                        '/src/icons/message_state_full_readed.png' ,
                        '/src/icons/message_state_halfreaded.png' ,
                        '/src/icons/message_state_sended.png' ,
                        '/src/icons/minus_button.png' ,
                        '/src/icons/notification_background.png' ,
                        '/src/icons/notification_icon.png',
                        '/src/icons/notification_icon_mob.png' ,
                        '/src/icons/notification_large.png' ,
                        '/src/icons/ok_btn.png' ,
                        '/src/icons/orden_logo.png' ,
                        '/src/icons/pan_ic.png' ,
                        '/src/icons/phone.png' ,
                        '/src/icons/plus_button.png' ,
                        '/src/icons/pointer.png' ,
                        '/src/icons/pointer_cuartel.png' ,
                        '/src/icons/progress_btn_back.png' ,
                        '/src/icons/progress_gif.gif' ,
                        '/src/icons/rec_btn.png' ,
                        '/src/icons/red_point.png' ,
                        '/src/icons/repo_ic.png' ,
                        '/src/icons/save_btn.png' ,
                        '/src/icons/seguir_comprando_icon.png' ,
                        '/src/icons/send_btn.png' ,
                        '/src/icons/share_menu.png' ,
                        '/src/icons/simple_ok.png' ,
                        '/src/icons/simple_ok_duo.png' ,
                        '/src/icons/simple_ok_green.png' ,
                        '/src/icons/simple_ok_orange.png' ,
                        '/src/icons/strike_line.png' ,
                        '/src/icons/tallo.png' ,
                        '/src/icons/title.png' ,
                        '/src/icons/toggle_off.png' ,
                        '/src/icons/toggle_on.png' ,
                        '/src/icons/upleft_arrow.png' ,
                        '/src/icons/user_friend.png' ,
                        '/src/icons/user_icon.png' ,
                        '/src/icons/usu.png' ,
                        '/src/icons/usu_orange.png' ,
                        '/src/icons/vot_icon.png' ,
                        '/src/icons/wait.gif' ,
                        '/src/icons/wait_gif.gif' ,
                        '/src/icons/week_btn_blanck.png' ,
                        '/src/icons/zero_img.png',
                        '/src/prods/acema.png' , 
                        '/src/prods/bunuelo.png' , 
                        '/src/prods/croissant.png' , 
                        '/src/prods/cuajada_248.png' , 
                        '/src/prods/cuajada_48.png' , 
                        '/src/prods/cuajada_480.png' , 
                        '/src/prods/integral_calabaza.png' , 
                        '/src/prods/integral_pasas_240.png' , 
                        '/src/prods/integral_pasas_480.png' , 
                        '/src/prods/integral_pasas_peque.png' , 
                        '/src/prods/integral_peque_cala.png' , 
                        '/src/prods/mantequilla_248.png' , 
                        '/src/prods/mantequilla_480.png' , 
                        '/src/prods/mantequilla_50gr.png' , 
                        '/src/prods/pandebono.png' , 
                        '/src/prods/roscon_arequipe.png' , 
                        '/src/prods/roscon_guayaba.png' , 
                        '/src/prods/stollen.png',
                        'service-worker.js'
                    ]
                );
        })
    );
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.open('med_deli_cache_icons').then(function(cache) {
            return cache.match(event.request).then(function (response) {
                console.log('searching in chache');
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                    
                    
                });
            });
        })
    );
});
self.addEventListener('notificationclick', function(event){
	var clickedNotification = event.notification;
	var promiseChain = clients.openWindow('/index.html');
	if(!event.action){
            console.log('Opening WebApp');
            clickedNotification.close();
            event.waitUntil(promiseChain);
            return;
    }else{
    	switch(event.action){
            case 'opt1':
                console.log('opt1');
                clickedNotification.close();
                event.waitUntil(promiseChain);
                break;
            case 'opt2':
                console.log('opt2');
                clickedNotification.close();
                event.waitUntil(promiseChain);
                break;
        }

    }
        

});




