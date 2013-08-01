
/**
 @author Riku Hokkanen (commented and cleared for Nest)
 @copyright 
 @namespace Webchat UI logic
*/

$.use("js/jaxl.js");

$(function() {
   boshMUChat.init();
});

var boshMUChat = function() {

   var onlineUsers = new Array();
   
   return {
      payloadHandler:payloadHandler,
      appendMessage:appendMessage,
      prepareMessage:prepareMessage,
      init:init
   }
   
   /**Handles the payload depending on payload.jaxl. Possible jaxl states
      are authFailed, connected, disconnected, message and presence */
   function payloadHandler(payload) {
      
      switch(payload.jaxl) {
         case 'authFailed':
         {
            jaxl.setConnected(false);
            break;
         }
         case 'connected':
         {
            jaxl.setConnected(true);
            jaxl.setJid(payload.jid);
            jaxl.ping();
            
            break;
         }
         case 'disconnected':
         {
            jaxl.setConnected(false);
            jaxl.setDisconnecting(false);
            console.log('disconnect :<');
            break;
         }
         case 'message':
         {
            appendMessage(jaxl.urlDecode(payload.message));
            jaxl.ping();
            break;
         }
         case 'presence':
         {
            appendMessage(jaxl.urlDecode(payload.presence));
            
            onlineUsers[payload.statusChange.user] = payload.statusChange.status;
            $('#onlineUsers').replaceWith(createUserList(onlineUsers));
            
            console.log(onlineUsers);
   
            
            jaxl.ping();
            break;
         }
         case 'pinged':
         {
            jaxl.ping();
            break;
         }
      }
   }

   /**Adds message to the messagebox div */   
   function appendMessage(msg) {
      $('#messageBox').append(msg);
   }
   
   function createUserList(onlineUsers, roomName) {
      var list = $('<ul></ul>');
      list.addClass('userList');
      list.attr('id', 'onlineUsers');
      
      var userDiv = $('<li></li>');
      userDiv.addClass('user');
      
      for(user in onlineUsers) {
         if(onlineUsers[user] == 'available') {
            var us = userDiv.clone();
            us.text(user);
            list.append(us);
         }
      }
      
      return list;
      
   }


   /**constructs html structure for a message */   
   function prepareMessage(message) {
      var html = '';
      html += '<div class="mssgIn">';
      html += '<p class="from">'+jid+'</p>';
      html += '<p class="body">'+message+'</div>';
      html += '</div>';      
   }
   /**Sets button events, payloadHandler etc */
   function init() {
      jaxl.setPollUrl('php/webChat.php');
      jaxl.setPayLoadHandler(new Array('boshMUChat', 'payloadHandler'));
      
      
      jaxl.connect(data={'user':'test', 'pass':'test'});
      
      $('#inputField').keydown(function(e) {
         if(e.keyCode == 13 && jaxl.getConnected()) { //13 = enter
            message = $.trim($(this).val());
            if(message.length == 0) return false;
            $(this).val('');


            jaxl.sendPayLoad({
               'jaxl':'message',
               'message':message
               });
         }
      });      
      
   }
   
   
}();




