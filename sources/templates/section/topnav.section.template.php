<?php namespace templates\section\topnav; ?>
<?php function topnav ( $prefix = './' , $current = 0 ){?>
<div class="topnav" data-controller="topnav">
	<nav class="navbar navbar-expand-sm bg-primary navbar-dark topnav-fixed-top">
		<a class="navbar-brand" href="javascript:void(0);" data-event="topnav.click.route" data-params='{"path":""}'>
			<img  data-valuectrl="topnav.companylogo" alt="Logo" style="width:7vh;">
		</a>
		<ul class="navbar-nav mr-auto" >
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='dashboard' data-event="topnav.click.route" data-params='{"path":""}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> DASHBOARD
			  </a>
			</li>
			
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='residents' data-event="topnav.click.route" data-params='{"path":"residents"}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> RESIDENTS
			  </a>
			</li>
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='clerk' data-event="topnav.click.route" data-params='{"path":"clerk"}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> CLERK
			  </a>
			</li>
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='lupon' data-event="topnav.click.route" data-params='{"path":"lupon"}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> LUPON
			  </a>
			</li>
			
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='hr' data-event="topnav.click.route" data-params='{"path":"hr"}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> HR
			  </a>
			</li>
			
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='healthcenter' data-event="topnav.click.route" data-params='{"path":"healthcenter"}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> HEALTH CENTER
			  </a>
			</li>
			
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='projects' data-event="topnav.click.route" data-params='{"path":"projects"}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> PROJECTS
			  </a>
			</li>
			<!--<li class="nav-item">
			  <a id='settings' data-event="topnav.click.route" data-params='{"path":"settings"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> General Settings
			 </a>
			</li>-->
			<!--<li class="nav-item">
			  <a id='specialsubject' data-event="topnav.click.route" data-params='{"path":"settings"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> Reports
			 </a>
			</li>-->
			<!--<li class="nav-item">
			  <a id='specialsubject' data-event="topnav.click.route" data-params='{"path":"settings"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> Settings
			 </a>
			</li>-->	
		</ul>
		 <ul class="navbar-nav">
		  <li class="nav-item">
			<img  id='top-profpic' src='<?php echo $prefix; ?>sources/images/prof.jpg' alt="Logo" style="width:6vh;">
			&nbsp;
		  </li>
		  <li class="nav-item">
			<b style="line-height:5px;"><a data-event="topnav.click.route" data-params='{"path":"userprofile"}' class="nav-link active" href="javascript:void(0);" data-valuectrl="topnav.name"></a></b>
			<span style="line-height:1px;"><a href="javascript:void(0);"  class="nav-link active" data-valuectrl="topnav.position"></a></span>
		  </li>
		  <!--<li class="nav-item">
			<a class="nav-link" href="javascript:void(0);" ><i class='icon-bell'></i></a>
		  </li>-->
		  <li id="switch-account-menu" class="nav-item">
			<a title="Switch Account" class="nav-link" href="javascript:void(0);" data-event="topnav.click.switchDesignation" ><i class='icon-refresh'></i></a>
		  </li>
		  <li class="nav-item">
			<a title='Sign Out' class="nav-link" href="javascript:void(0);" data-event="topnav.click.logout"><i class='icon-signout'></i></a>
		  </li>
		  
		</ul>
	</nav>
</div>
<?php } ?>	
