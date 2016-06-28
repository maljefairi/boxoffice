export const ItemTemplate = `
  <h1 class="header">{{ title }}</h1>
  <div class="row">
    <div class="col-sm-6 col-xs-12">
      <div class="content">
        <h3>Category</h3>
        <hr>
        <p>
          {{category_title}}
        </p>
        <h3>Description</h3>
        <hr>
        <p>
          {{{description}}}
        </p>
      </div>
    </div>
    <div class="col-sm-6 col-xs-12">
      <h3>Prices</h3>
      <hr>
      {{#prices}}
        <div class="panel panel-default">
          <div class="panel-body">
            <strong>{{title}}</strong>
            <br>
            {{currency}} {{amount}}
            <br>
            <strong>Starts on</strong> {{start_at}}
            <br>
            <strong>Ends on</strong> {{end_at}}
          </div>
        </div>
      {{/}}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-6 col-xs-12">
      <div class="content">
        {{#if discount_policies.length}}
        <h3>Discounts</h3>
        <hr>
        {{/if}}
        {{#discount_policies}}
          <div class="panel panel-default">
            <div class="panel-body">
              <strong>{{title}}</strong>
              <br>
            </div>
          </div>
        {{/}}
      </div>
    </div>
  </div>
`
