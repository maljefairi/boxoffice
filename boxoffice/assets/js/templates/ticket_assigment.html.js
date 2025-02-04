export const TicketAssignmentTemplate = `
  {{#line_items:line_item}}
    {{#if is_confirmed}}
      <div class="ticket col-sm-6 col-xs-12" id="item-{{ seq }}">
        <div class="heading">
          <div class="ticket-type">
            <p>{{ title }}</p>
          </div>
          <div class="ticket-edit">
            {{#if assignee.id || isTicketAssigned}}
              <span><i class="fa fa-user"></i><i class="fa fa-check"></i></span>
              {{#if is_transferable}}<span class="edit-btn" on-click="assign(event, event.keypath, true)"><i class="fa fa-edit"></i></span>{{/if}}
            {{else}}
              <span><i class="fa fa-user"></i><i class="fa fa-question"></i></span>
            {{/if}}
          </div>
        </div>
        <div class="content">
          {{#if !toAssign}}
            <div class="content-box clearfix" intro='fly:{"x":20,"y":"0"}'>
              <div class="item-description">{{{ description }}}</div>
              <p class="price center">&#8377;{{ final_amount }}</p>
              {{#if assignee.id || isTicketAssigned}}
                <p class="confirmation-msg"><i class="fa fa-check"></i> This ticket has been assigned to {{assignee.fullname}}</p>
              {{/if}}
              <div class="assign-form-wrapper">
                {{#if assignee.id || isTicketAssigned}}
                  {{#if is_transferable}}
                    <div class="text-center continue-btn-wrapper">
                      <button class="boxoffice-button boxoffice-button-action" on-click="assign(event, event.keypath, true)">Transfer/Edit</button>
                    </div>
                  {{/if}}
                {{else}}
                  <p class="assign-form-title">Fill attendee details</p>
                  <div class="text-center continue-btn-wrapper">
                    <button class="boxoffice-button boxoffice-button-action" on-click="assign(event, event.keypath, false)">Continue</button>
                  </div>
                {{/if}}
              </div>
            </div>
          {{else}}
            <div class="content-box clearfix" intro='fly:{"x":20,"y":"0"}'>
              <h4 class="text-center attendee-form-title">Please fill the attendee details</h4>
              <form class="attendee-form clearfix" role="form" name="attendee-form-{{seq}}" id="attendee-details-{{seq}}">
                  <div class="group">
                    <input class="group-input {{#filled || assignee.fullname}}filled{{/}}" type="text" name="fullname" value="{{assignee.fullname}}" on-blur="inputFieldEdit(event, event.keypath)">
                    <span class="bar"></span>
                    <label class="group-label">Fullname</label>
                    {{#assignee.errormsg.fullname}}<p class="form-error-msg">{{ assignee.errormsg.fullname }}</p>{{/}}
                  </div>

                  <div class="group">
                    <input class="group-input {{#filled || assignee.email}}filled{{/}}" type="text" name="email" value="{{assignee.email}}" on-blur="inputFieldEdit(event, event.keypath)">
                    <span class="bar"></span>
                    <label class="group-label">Email</label>
                    {{#assignee.errormsg.email}}<p class="form-error-msg">{{ assignee.errormsg.email }}</p>{{/}}
                  </div>

                  <div class="group">
                    <input class="group-input {{#filled || assignee.phone}}filled{{/}}" type="text" name="phone" value="{{assignee.phone}}" on-blur="inputFieldEdit(event, event.keypath)">
                    <span class="bar"></span>
                    <label class="group-label">Phone</label>
                    {{#assignee.errormsg.phone}}<p class="form-error-msg">{{ assignee.errormsg.phone }}</p>{{/}}
                  </div>

                  {{#assignee_details: field}}
                    {{#if field_type === 'string'}}
                      <div class="group">
                        <input class="group-input {{#filled || assignee.details[field]}}filled{{/}}" type="text" name="{{field}}" value="{{assignee.details[field]}}" on-blur="inputFieldEdit(event, event.keypath)">
                        <span class="bar"></span>
                        <label class="group-label">{{label}}</label>
                      </div>
                    {{elseif field_type === 'select'}}
                      <div class="group-select">
                        <p class="field-title filled">{{label}}</p>
                        <select name="{{field}}" value="{{assignee.details[field]}}">
                          {{#options: option}}
                            <option value="{{options[option]}}">{{options[option]}}</option>
                          {{/options}}
                        </select>
                      </div>
                    {{elseif field_type === 'checkbox'}}
                      <div class="group">
                        <input class="group-checkbox filled" type="checkbox" value="{{option}}" id="{{seq}}-{{option}}" {{#if assignee.details[field] == option }}checked{{/if}} name="{{{field}}}">
                        <label class="field-title" for="{{seq}}-{{option}}">{{label}}</label>
                      </div>
                    {{elseif field_type === 'textbox'}}
                      <div class="group">
                        <label class="field-title">{{label}}</label>
                        <textarea class="form-control" name="{{field}}" value="{{assignee.details[field]}}"></textarea>
                      </div>
                    {{/if}}
                  {{/}}
                  <div class="assign-btn-wrapper">
                    <button type="button" class="boxoffice-button boxoffice-button-info" on-click="viewTicket(event, event.keypath, seq)">Back</button>
                    <button type="submit" class="boxoffice-button boxoffice-button-action" on-click="addAttendeeDetails(event, event.keypath, seq, id)" {{#assigningTicket}}disabled{{/}}>
                        {{#if assignee.id || isTicketAssigned}}Update{{else}}Assign ticket{{/if}}
                        {{#assigningTicket}}<i class="fa fa-spinner fa-spin" intro='fly:{"x":0,"y":"0"}'>{{/}}
                    </button>
                  </div>
                {{#errorMsg}}
                    <p class="error-msg">{{ errorMsg }}</p>
                {{/}}
              </form>
            </div>
          {{/if}}
        </div>
      </div>
    {{/if}}
  {{/line_item}}
  {{#line_items:line_item}}
    {{#if is_cancelled}}
      <div class="ticket col-sm-6 col-xs-12" id="item-{{ seq }}">
        <div class="heading">
          <div class="ticket-type">
            <p>{{ title }}</p>
          </div>
      </div>
      <div class="content">
        <div class="content-box cancelled-ticket clearfix">
          <div class="item-description">{{{ description }}}</div>
          <p class="price center">&#8377;{{ final_amount }}</p>
          {{#if assignee.id}}
            <p class="confirmation-msg"><i class="fa fa-check"></i> This ticket has been assigned to {{assignee.fullname}}</p>
          {{/if}}
          <div class="cancel-msg">
            <p>Cancelled on {{ formatDate(cancelled_at) }}</p>
          </div>
        </div>
      </div>
    {{/if}}
  {{/line_item}}
`;
