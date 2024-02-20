 <%if(dataNotif) { %>

          <%for( item of dataNotif ) { %>

            <%if(item.isRead==true) { %>

              <div class="row">
                <div class="col-md-12 notif-lu"><%=item.message%></div>
              </div>

              <% }else { %>

                <div class="row">
                  <div class="col-md-12 notif-non-lu"><%=item.message%></div>
                </div> 

              <% } %>  

                <% } %>
              <% }else{%>
                <h5>Il n'y a pas de notification</h5>
              <% } %>  