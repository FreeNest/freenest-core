<?php

/*
Code from
http://davidwalsh.name/create-html-elements-php-htmlelement-class
by David Walsh.

With few fixes as suggested on the comments and otherwise :>

*/

class html_element
{
  /* vars */
  var $type;
  var $attributes;
  var $self_closers;
  
  /* constructor */
  function html_element($type,$self_closers = array('input','img','hr','br','meta','link'))
  {
    $this->type = strtolower($type);
    $this->self_closers = $self_closers;
  }
  
  /* get */
  function get($attribute)
  {
    return $this->attributes[$attribute];
  }
  
  /* set -- array or key,value */
  function set($attribute,$value = '')
  {
    if(!is_array($attribute))
    {
      $this->attributes[$attribute] = $value;
    }
    else
    {
      $this->attributes = array_merge($this->attributes,$attribute);
    }
  }
  
  /* remove an attribute */
  function remove($att)
  {
    if(isset($this->attributes[$att]))
    {
      unset($this->attributes[$att]);
    }
  }
  
  /* clear */
  function clear()
  {
    $this->attributes = array();
  }
  
  /* inject */
  function inject($object)
  {
    if(@get_class($object) == __class__)
    {
      if(!isset($this->attributes['text'])){
        $this->attributes['text'] = $object->build();
      }else{
        $this->attributes['text'].= $object->build();
      }
    }
  }
  
  /* build */
  function build()
  {
    //start
    $build = '<'.$this->type;
    
    //add attributes
    if(count($this->attributes))
    {
      foreach($this->attributes as $key=>$value)
      {
        if($key != 'text') { $build.= ' '.$key.'="'.$value.'"'; }
      }
    }
    
    //closing
    if(!in_array($this->type,$this->self_closers) && isset($this->attributes['text']))
    {
      $build.= '>'.$this->attributes['text'].'</'.$this->type.'>';
    }
    else
    {
      $build.= ' />';
    }
    
    //return it
    return $build;
  }
  
  /* spit it out */
  function output()
  {
    echo $this->build();
  }
}

?>
